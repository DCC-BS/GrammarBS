import os


class Configuration:
    def __init__(self) -> None:
        self.api_port: int = int(os.getenv('API_PORT', 8090))
        self.openai_api_base_url: str = os.getenv('OPENAI_API_BASE_URL', 'http://localhost:8000/v1')
        self.openai_api_key: str = os.getenv('OPENAI_API_KEY', 'none')
        self.llm_model: str = os.getenv('LLM_MODEL', 'ollama_chat/llama3.2')
        self.language_tool_api_url: str = os.getenv('LANGUAGE_TOOL_API_URL', 'http://localhost:8010/')

config = Configuration()
