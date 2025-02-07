from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.text_corretion_models import CorrectionResult, TextCorrectionOptions
from models.text_rewrite_models import RewriteResult, TextRewriteOptions
from services.rewrite_text import TextRewriteService
from services.text_correction_language_tool import TextCorrectionService

app = FastAPI()

# Configure CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Nuxt.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

text_correction_service = TextCorrectionService()
text_rewrite_service = TextRewriteService()

class ChatPrompt(BaseModel):
    text: str

@app.post("/text-correction")
def chat_completions(text: ChatPrompt) -> CorrectionResult:
    result = text_correction_service.correct_text(text.text, TextCorrectionOptions())

    if result.is_left():
        raise HTTPException(status_code=400, detail=result.left())

    return result.right()

class RewritePrompt(BaseModel):
    text: str
    context: str
    domain: str = "general"
    formality: str = "neutral"


@app.post("/text-rewrite")
def rewrite_text(data: RewritePrompt) -> RewriteResult:

    options = TextRewriteOptions(
        domain=data.domain,
        formality=data.formality
    )

    result = text_rewrite_service.rewrite_text(data.text, data.context, options)

    if result.is_left():
        raise HTTPException(status_code=400, detail=result.left())

    return result.right()

