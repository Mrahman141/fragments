# Stage 1: Build dependencies
FROM node:22.8.0@sha256:bd00c03095f7586432805dbf7989be10361d27987f93de904b1fc003949a4794 AS build

LABEL maintainer="Mohammed Aminor Rahman <mrahman141@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false
ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app

# Install curl for health check functionality
RUN apk add --no-cache curl=8.9.1-r0

# Copy only the necessary files from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/tests/.htpasswd ./tests/.htpasswd
COPY --from=build /app/package*.json ./

# Health check to verify the server is running
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080 || exit 1

CMD ["npm", "start"]
EXPOSE 8080
