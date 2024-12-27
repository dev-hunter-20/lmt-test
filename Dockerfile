# Build BASE
FROM node:18-alpine as BASE

WORKDIR /app
COPY package.json yarn.lock .env.development .env.production ./
COPY .env.production ./.env
RUN apk add --no-cache git \
    && yarn --frozen-lockfile \
    && yarn cache clean \
    && yarn add sharp

# Build Image
FROM node:18-alpine AS BUILD

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build \
    && cd .next/standalone \
    && curl -sf https://gobinaries.com/tj/node-prune | sh \
    && node-prune /app/node_modules

# Build production
FROM node:18-alpine AS PRODUCTION

WORKDIR /app
COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static
COPY --from=BUILD /app/.next/cache ./.next/cache

EXPOSE 3000

CMD ["node", "server.js"]