# Multi-stage Dockerfile for Backend service
# This is a placeholder configuration - adjust based on your backend technology choice

# For Node.js backend (uncomment and modify as needed)
FROM node:20-alpine AS backend
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Placeholder for backend setup
# COPY package*.json ./
# RUN npm ci --only=production
# COPY . .

# For now, just create a simple health check endpoint
RUN echo '{"status":"Backend not yet implemented"}' > health.json

# Install a simple HTTP server for placeholder
RUN npm install -g http-server

# Change ownership
RUN chown -R backend:nodejs /app

USER backend

EXPOSE 4000

# Serve the health check file on port 4000
CMD ["http-server", "-p", "4000", "-c-1"]

# ===== Alternative configurations for different backend technologies =====

# # For Python/FastAPI backend
# FROM python:3.11-slim AS backend
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY . .
# EXPOSE 4000
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "4000"]

# # For Go backend
# FROM golang:1.21-alpine AS builder
# WORKDIR /app
# COPY go.mod go.sum ./
# RUN go mod download
# COPY . .
# RUN go build -o main .
# 
# FROM alpine:latest AS backend
# RUN apk --no-cache add ca-certificates
# WORKDIR /root/
# COPY --from=builder /app/main .
# EXPOSE 4000
# CMD ["./main"]

# # For Java/Spring Boot backend
# FROM openjdk:17-alpine AS backend
# WORKDIR /app
# COPY target/*.jar app.jar
# EXPOSE 4000
# CMD ["java", "-jar", "app.jar"]