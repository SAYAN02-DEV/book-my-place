FROM node:20-alpine3.19 AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm install

FROM deps AS builder
#COPY <host-current-folder> → <container-current-folder>
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
# Create non-root user for runtime
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
