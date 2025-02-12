# Stage 1: Build the application
FROM python:3.12-slim AS build

# use the uv image to install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set the working directory
WORKDIR /usr/src/app

# Copy the uv files
COPY pyproject.toml ./
COPY uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy the rest of the application code
COPY . .

# Stage 2: Run the application
FROM python:3.12-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --from=build /usr/src/app ./

# use the uv image to install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install uvicorn
RUN uv add uvicorn

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["uv", "run", "run.py", "--production"]
