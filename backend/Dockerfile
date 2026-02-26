# Build context must be repo root (Railway: root or rootDirectory unset)
FROM node:20-alpine
WORKDIR /app

# Root: install deps and run artifact scripts (creates /app/public)
COPY package.json ./
RUN npm install
COPY assets ./assets
COPY scripts ./scripts
RUN npm run prebuild

# Backend
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npm ci --omit=dev

EXPOSE 3001
CMD ["node", "server.js"]
