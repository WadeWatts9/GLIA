FROM node:24-alpine

# Set Node environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Install build tools required for better-sqlite3 (native C++ module)
RUN apk add --no-cache python3 make g++

# Create app directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production-only dependencies (compiles better-sqlite3)
RUN npm ci --omit=dev

# Remove build tools to keep the image lean
RUN apk del python3 make g++

# Copy server code and static assets
COPY server.js database.js ./
COPY public ./public

# Create data directory and assign ownership to node user
RUN mkdir -p /app/data && chown -R node:node /app

# Use non-privileged node user for security
USER node

# Expose application port
EXPOSE 3000

# Start GLIA application
CMD ["node", "server.js"]
