# Load the env file function
. ./scripts/Load-EnvFile.ps1

# Load the environment variables
Load-EnvFile -envPath ".env"

Write-Host "${env:LLM_API_PORT}"
Write-Host "${env:OPENAI_API_BASE_URL}"
