FROM node:18-alpine

WORKDIR /app

# Install build tools and crypto dependencies
RUN apk add --no-cache bash git openssl

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Start app
CMD ["node", "dist/main"]
