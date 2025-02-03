from openai import OpenAI

class TextCorrectionOptions:
    def __init__(self, language: str, writing_style: str, tone: str, formality: str):
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


class TextCorrectionService:
    def __init__(self):


        self.client = OpenAI(
            base_url="http://localhost:8000/v1",  # Your local API endpoint
            api_key="your_secret_key_here",
        )

    def correct_text(self, text: str, options: TextCorrectionOptions) -> str:
        response = self.client.chat.completions.create(
            model="Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4",
            messages=[
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content
