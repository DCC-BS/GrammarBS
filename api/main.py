import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.text_correction import TextCorrectionService, TextCorrectionOptions
from pydantic import BaseModel

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

class ChatPrompt(BaseModel):
    text: str

@app.post("/text-correction")
def chat_completions(text: ChatPrompt):
    result = text_correction_service.correct_text(text.text, TextCorrectionOptions())

    if result.is_left():
        raise HTTPException(status_code=400, detail=result.left())
    return result.right()
