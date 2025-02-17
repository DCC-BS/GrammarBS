# GrammarBS


create an  .env file in the root of the project and add the following variables:

```txt
HUGGING_FACE_HUB_TOKEN=[YOUR_HUGGINFACE_HUB_TOKEN]
HUGGING_FACE_CACHE_DIR='C:/Users/[YOUR_USER]/.cache/languagetool'
LLM_API_PORT=8000
API_PORT=8090
API_URL='http://localhost:${API_PORT}'
CLIENT_PORT=3000
CLIENT_URL='http://localhost:${CLIENT_PORT}'
OPENAI_API_BASE_URL='http://localhost:${LLM_API_PORT}/v1'
OPENAI_API_KEY='none'
LLM_MODEL='Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4'

LANGUAGE_TOOL_PORT=8010
LANGUAGE_TOOL_API_URL='http://localhost:${LANGUAGE_TOOL_PORT}/v2'
LANGUAGE_TOOL_CACHE_DIR='C:/Users/[YOUR_USER]/.cache/languagetool'
DEV=true
```

create the docker network:
```powershell
./scripts/create_network.ps1
```

run the docker compose
```powershell
docker compose up
```

you can also create docker images for the client and api:
```powershell
.\scripts\build-api.ps1
.\scripts\build-client.ps1
```

and then start them with
```powershell
.\scripts\run-api.ps1
.\scripts\run-client.ps1
```
