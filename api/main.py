import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from open_api import some_function

app = FastAPI()

# Configure CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Nuxt.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the API"}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello, {name}!"}

@app.get("/test")
def chat_completions():
    response = some_function()
    return { "response": response }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
