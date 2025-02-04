from typing import Annotated, final
from annotated_types import MaxLen
from openai import OpenAI
from pydantic import BaseModel, Field
from utils.text_correction_utils import OPENAI_TEMPLATE, SYSTEM_MESSAGE
from utils.either import Either, left, right
from utils.configuration import config

@final
class TextCorrectionOptions:
    def __init__(self, language: str = 'de', writing_style: str = 'simple', tone: str = 'neutral', formality: str = 'formal'):
        """
        language: str
        writing_style: simple, buisiness, academic, casual, technical, legal, medical, scientific, etc.
        tone: Enthusiastic, neutral, friendly, confident, diplomatic, etc.
        formality: formal, informal, neutral, etc.
        """
        self.language = language
        self.writing_style = writing_style
        self.tone = tone
        self.formality = formality


class CorrectionBlock(BaseModel):
    original: Annotated[str, "The original text"]
    corrected: Annotated[str, "The corrected text"]
    explanation: Annotated[str, Field(description="A short explanation of the correction use the language of the original text")]

class CorrectionBlocks(BaseModel):
    blocks: list[CorrectionBlock]

json_schema = CorrectionBlocks.model_json_schema()

class CorrectionResult(BaseModel):
    original: str
    blocks: list[CorrectionBlock]

@final
class TextCorrectionService:


    def __init__(self):
        self.client = OpenAI(
            base_url=config.openai_api_base_url,
            api_key=config.openai_api_key
        )

    def correct_text(self, text: str, options: TextCorrectionOptions) -> Either[str, CorrectionResult]:
        """Corrects the input text based on given options.
        Returns Either[str, str] where:
        - Left(str) contains error message
        - Right(str) contains corrected text
        """

        system_message = SYSTEM_MESSAGE

        print(json_schema)

        propmt = OPENAI_TEMPLATE.format(
            prompt=text,
            language=options.language,
            writing_style=options.writing_style,
            tone=options.tone,
            formality=options.formality
        )

        response = self.client.chat.completions.create(
            model="Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": propmt}
            ],
            max_tokens=1000,
            temperature=0.2,
            extra_body={"guided_json": json_schema}
        )

        if len(response.choices) != 1:
            return left("Unexpected number of choices in response")
        if response.choices[0].message.content is None:
            return left("Unexpected None content in response")

        correction_blocks = CorrectionBlocks.model_validate_json(response.choices[0].message.content)

        return right(
            CorrectionResult(blocks=correction_blocks.blocks, original=text)
        )
