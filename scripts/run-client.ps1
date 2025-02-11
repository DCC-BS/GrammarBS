docker run `
    -p 3000:3000 `
    --name grammar-bs-client `
    --env "CLIENT_PORT=3000" `
    --env "API_URL=http://localhost:3000"`
    grammar-bs-client
