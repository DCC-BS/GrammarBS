# Load the env file function
. ./scripts/Load-EnvFile.ps1

# Load the environment variables
Load-EnvFile -envPath ".env"

docker run -d `
  --name languagetool `
  --restart unless-stopped `
  --cap-drop ALL `
  --cap-add CAP_SETUID `
  --cap-add CAP_SETGID `
  --cap-add CAP_CHOWN `
  --security-opt no-new-privileges `
  --publish ${env:LANGUAGE_TOOL_PORT}:8010 `
  --env download_ngrams_for_langs=de,en`
  --read-only `
  --tmpfs /tmp `
  --volume ${env:LANGUAGE_TOOL_NGRAMS_DIR}:/ngrams `
  --volume ${env:LANGUAGE_TOOL_FASTTEXT_DIR}:/fasttext `
  meyay/languagetool:latest
