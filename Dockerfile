# Build an environment that runs the test suite automatically
FROM node:18-bullseye

WORKDIR /app

# Install build tools for npm packages that might need compilation
RUN apt-get update && apt-get install -y build-essential git ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy only package files first (cache optimization)
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci --prefer-offline --no-audit --progress=false; else npm install --no-audit --progress=false; fi

# Copy the rest of the project
COPY . .

# Compile contracts (ensures compiler is downloaded)
RUN npx hardhat compile

# Default command = run test suite
CMD ["npx", "hardhat", "test", "--no-compile"]
