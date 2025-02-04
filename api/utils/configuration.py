import os

class Configuration:
    def __init__(self):
        self.api_port: int = int(os.getenv('API_PORT', 8090))
        self.openai_api_base_url: str = os.getenv('OPENAI_API_BASE_URL', 'http://localhost:8000/v1')
        self.openai_api_key: str = os.getenv('OPENAI_API_KEY', 'none')



config = Configuration()
