. ./scripts/Load-EnvFile.ps1
Load-EnvFile -envPath ".env"

docker build .\api\ -t grammar-bs-api
