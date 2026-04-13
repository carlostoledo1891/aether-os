FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production=false
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc
RUN npm prune --production

FROM node:22-alpine
RUN apk add --no-cache wget && \
    addgroup -g 1001 -S vero && \
    adduser -S vero -u 1001 -G vero
WORKDIR /app
COPY --from=build --chown=vero:vero /app/node_modules ./node_modules
COPY --from=build --chown=vero:vero /app/dist ./dist
COPY --from=build --chown=vero:vero /app/package.json ./
RUN mkdir -p /app/data && chown vero:vero /app/data
USER vero
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1
CMD ["node", "dist/index.js"]
