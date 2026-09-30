# ==============================================================================
# Multi-Stage Production Dockerfile for IoT Hub Automation Hub
# Base image includes official Playwright browsers and system dependencies
# ==============================================================================
FROM mcr.microsoft.com/playwright:v1.50.0-jammy AS base

WORKDIR /app

# Install Java (JRE) for Allure Report generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jre \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy entire application codebase
COPY . .

# Ensure report & artifact storage directories exist with appropriate permissions
RUN mkdir -p reports/allure-results reports/allure-report reports/artifacts reports/test-results \
    && chmod -R 777 reports

# Expose Web Portal and API Server Port
EXPOSE 3030

# Healthcheck for Kubernetes / Docker Swarm Liveness Probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3030/api/health || exit 1

# Environment Defaults
ENV NODE_ENV=production
ENV PORT=3030
ENV CI=true

# Start Enterprise Automation Hub Server
CMD ["npm", "start"]
