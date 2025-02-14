. ./scripts/Load-EnvFile.ps1
Load-EnvFile -envPath ".env"

docker run `
    -d `
    -p ${env:API_PORT}:${env:API_PORT} `
    --name grammar-bs-api `
    --hostname grammar-bs-api `
    --env "API_PORT=${env:API_PORT}" `
    --env "LLM_API_PORT=${env:LLM_API_PORT}" `
    --env "OPENAI_API_BASE_URL=http://vllm_qwen25_32b:${env:LLM_API_PORT}/v1" `
    --env "OPENAI_API_KEY=${env:OPENAI_API_KEY}" `
    --env "LLM_MODEL=${env:LLM_MODEL}" `
    --env "LANGUAGE_TOOL_API_URL=http://languagetool:${env:LANGUAGE_TOOL_PORT}/v2" `
    --env "CLIENT_URL=${env:CLIENT_URL}" `
    --network grammar-bs-network `
    grammar-bs-api
