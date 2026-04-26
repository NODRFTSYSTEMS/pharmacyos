# PEO — Peak Equity Optimizer
# Multi-stage Docker build for production deployment
# Node.js 24 LTS (matches project runtime)

# ─── Dependencies Stage ───────────────────────────────────────────────────────
FROM node:24-slim AS deps
WORKDIR /app

# Install pnpm (project package manager)
RUN npm install -g pnpm@10

# Copy lockfile and package manifest first (layer caching)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# ─── Builder Stage ────────────────────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app

RUN npm install -g pnpm@10

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment (public vars only)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client before build
RUN pnpm prisma generate

# Build the Next.js application
RUN pnpm build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root user for security
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/false nextjs

# Copy only what's needed to run
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/

# Runtime env placeholder — injected at container start
ENV DATABASE_URL=""
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
ENV CLERK_SECRET_KEY=""
ENV RENTCAST_API_KEY=""

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/public/faq', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
