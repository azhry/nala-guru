FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
# Strip OpencodeProvider — requires `opencode` CLI not available in Docker
RUN sed -i "/import { OpencodeProvider } from '.\/opencode';/d" src/services/ai/index.ts && \
    sed -i "/new OpencodeProvider(),/d" src/services/ai/index.ts && \
    rm -f src/services/ai/opencode.ts
RUN npx tsc

FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
