FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production=false
COPY tsconfig.json ./
COPY src/ ./src/
RUN npx tsc
RUN npm prune --production

FROM node:22-alpine
RUN addgroup -g 1001 -S vero && \
    adduser -S vero -u 1001 -G vero
WORKDIR /app
COPY --from=build --chown=vero:vero /app/node_modules ./node_modules
COPY --from=build --chown=vero:vero /app/dist ./dist
COPY --from=build --chown=vero:vero /app/package.json ./
USER vero
CMD ["node", "dist/index.js"]
