# Load the env file function
. ./scripts/Load-EnvFile.ps1

# Load the environment variables
Load-EnvFile -envPath ".env"

docker run -d --rm -p ${env:LANGUAGE_TOOL_PORT}:8010 erikvl87/languagetool
