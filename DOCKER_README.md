# BETIM Docker Setup

This document provides instructions for running the BETIM application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)
- 4GB+ RAM available for Docker

## Quick Start

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/betim.git
cd betim

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 2. Using Make Commands (Recommended)

```bash
# Initial setup
make setup

# Start development environment
make dev

# Start production environment
make prod

# View all available commands
make help
```

### 3. Using Docker Compose Directly

#### Development Environment

```bash
# Start development environment with hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Build and start
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

#### Production Environment

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production services in background
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Stop production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Architecture

### Services

1. **Frontend** (Next.js)
   - Development: Port 3000 with hot-reload
   - Production: Optimized standalone build
   - URL: http://localhost:3000

2. **Backend** (Placeholder - customize based on your stack)
   - Development: Port 4000
   - Production: Port 4000
   - URL: http://localhost:4000

3. **PostgreSQL** (Database)
   - Port: 5432
   - Database: betim_db
   - User: betim

4. **Redis** (Cache/Sessions)
   - Port: 6379
   - Used for caching and session storage

5. **Nginx** (Reverse Proxy - Production only)
   - HTTP: Port 80
   - HTTPS: Port 443
   - Handles SSL, load balancing, and caching

6. **Adminer** (Database UI - Development only)
   - Port: 8080
   - URL: http://localhost:8080

## Common Tasks

### View Logs

```bash
# All services
make logs

# Specific service
make logs-frontend
make logs-backend
make logs-db
```

### Access Container Shell

```bash
# Frontend shell
make shell-frontend

# Backend shell
make shell-backend

# Database shell
make shell-db
```

### Database Management

```bash
# Access PostgreSQL CLI
make db-shell

# Backup database
make db-backup

# Restore database
make db-restore FILE=backup/betim_db_20240101_120000.sql
```

### Health Checks

```bash
# Check all services health
make health
```

## Environment Variables

Key environment variables (see `.env.example` for full list):

```env
# Application
NODE_ENV=development|production
VERSION=latest

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Backend
JWT_SECRET=your_secret_key
DATABASE_URL=postgresql://betim:password@postgres:5432/betim_db

# Database
DB_USER=betim
DB_PASSWORD=secure_password
DB_NAME=betim_db

# Redis
REDIS_PASSWORD=redis_password
```

## Production Deployment

### 1. Build Production Images

```bash
# Build with version tag
VERSION=1.0.0 make ci-build
```

### 2. Push to Registry

```bash
# Login to your registry
docker login registry.example.com

# Push images
VERSION=1.0.0 make push
```

### 3. Deploy on Server

```bash
# On production server
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. SSL Certificate Setup

For production, you'll need SSL certificates. Options:

1. **Let's Encrypt (Recommended)**
   ```bash
   # Install certbot
   docker run -it --rm --name certbot \
     -v /etc/letsencrypt:/etc/letsencrypt \
     -v /var/www/certbot:/var/www/certbot \
     certbot/certbot certonly --webroot \
     --webroot-path=/var/www/certbot \
     -d betim.com -d www.betim.com
   ```

2. **Custom Certificates**
   - Place your certificates in `nginx/ssl/`
   - Update paths in `nginx/nginx.prod.conf`

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Permission Issues

```bash
# Fix permissions
sudo chown -R $(whoami):$(whoami) .
```

### Clean Docker Resources

```bash
# Remove stopped containers
make clean

# Remove everything (containers, volumes, images)
make clean-all
```

### Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres pg_isready -U betim
```

## Monitoring

### Resource Usage

```bash
# View container stats
docker stats

# View specific service
docker stats betim-frontend
```

### Disk Usage

```bash
# View Docker disk usage
docker system df

# Clean unused resources
docker system prune -a
```

## Security Considerations

1. **Change default passwords** in production
2. **Use secrets management** for sensitive data
3. **Enable firewall** on production servers
4. **Regular security updates** for base images
5. **Implement rate limiting** in Nginx
6. **Use HTTPS** in production
7. **Regular backups** of database

## Performance Optimization

1. **Multi-stage builds** reduce image size
2. **Layer caching** speeds up builds
3. **Health checks** ensure service availability
4. **Resource limits** prevent container overuse
5. **Nginx caching** reduces backend load
6. **Connection pooling** for database

## Support

For issues or questions:
1. Check logs: `make logs`
2. Verify health: `make health`
3. Review environment variables
4. Check Docker daemon status
5. Consult documentation

## License

[Your License]