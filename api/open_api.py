from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",  # Your local API endpoint
    api_key="your_secret_key_here",
)


def some_function():
    try:
        response = client.chat.completions.create(
            model="Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4",
            messages=[
                {"role": "user", "content": "Hello!"}
            ]
        )
        return response
    except Exception as e:
        print(f"Error: {e}")
