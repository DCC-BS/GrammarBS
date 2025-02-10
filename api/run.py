import os
from pathlib import Path

from dotenv import load_dotenv

# Get the root directory (where .env file is located)
root_dir = Path(__file__).parent.parent
env_path = root_dir / ".env"

# Load environment variables from .env file
if env_path.exists():
    load_dotenv(env_path)
    print(f"Loaded environment from {env_path}")
else:
    print(f"Warning: .env file not found at {env_path}")

# Import and run the FastAPI application
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("API_PORT", 8090))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
