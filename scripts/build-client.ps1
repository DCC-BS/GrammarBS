. ./scripts/Load-EnvFile.ps1
Load-EnvFile -envPath ".env"

docker build .\client\ `
    -t grammar-bs-client
