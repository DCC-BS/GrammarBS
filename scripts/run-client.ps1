. ./scripts/Load-EnvFile.ps1
Load-EnvFile -envPath ".env"

docker run `
    -d `
    -p ${env:CLIENT_PORT}:${env:CLIENT_PORT} `
    --name grammar-bs-client `
    --hostname grammar-bs-client `
    --env "NUXT_PUBLIC_API_URL=http://grammar-bs-api:${env:API_PORT}" `
    --network grammar-bs-network `
    grammar-bs-client
