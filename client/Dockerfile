# Stage 1: Build the application
FROM node:18-alpine AS build

# Install bun
RUN npm install -g bun

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies using bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Run the application
FROM node:18-alpine

# Install bun
RUN npm install -g bun

# Set the working directory
WORKDIR /usr/src/app

# Copy the built application from the build stage
COPY --from=build /usr/src/app/.output ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "./server/index.mjs"]
