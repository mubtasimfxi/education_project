FROM node:20-alpine AS builder

WORKDIR /app

# Install root deps
COPY package.json ./
RUN npm install

# Build client
COPY client/package.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Install server deps
COPY server/package.json ./server/
RUN cd server && npm install
COPY server/ ./server/

# ─── Production image ──────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

# Set production env
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "server/index.js"]
