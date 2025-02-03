# Load the env file function
. ./scripts/Load-EnvFile.ps1

# Load the environment variables
Load-EnvFile -envPath ".env"

Write-Host "Starting VLLM Qwen2.5-32B-Instruct-GPTQ-Int4"
Write-Host "HUGGING_FACE_CACHE_DIR: $env:HUGGING_FACE_CACHE_DIR"
Write-Host "HUGGING_FACE_HUB_TOKEN: $env:HUGGING_FACE_HUB_TOKEN"
Write-Host "API_PORT: $env:API_PORT"

docker run -d `
    --name vllm_qwen25_32b `
    --runtime nvidia `
    --gpus all `
    -v "${env:HUGGING_FACE_CACHE_DIR}:/root/.cache/huggingface" `
    --env "HUGGING_FACE_HUB_TOKEN=${env:HUGGING_FACE_HUB_TOKEN}" `
    --env "VLLM_ATTENTION_BACKEND=FLASHINFER" `
    -p "${env:API_PORT}:8000" `
    --ipc=host `
    vllm/vllm-openai:v0.7.0 `
    --port 8000 `
    --model Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4 `
    --quantization "gptq_marlin" `
    --kv-cache-dtype "fp8_e5m2" `
    --tool-call-parser "hermes" `
    --max-model-len 16000 `
    --max-num-batched-tokens 4096 `
    --max-num-seqs 16 `
    --enable-prefix-caching `
    --enable-chunked-prefill `
    --gpu-memory-utilization 0.9 `
    --tensor-parallel-size 2
