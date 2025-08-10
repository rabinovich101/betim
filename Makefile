# BETIM Docker Makefile
# Provides convenient commands for Docker operations

.PHONY: help
help: ## Display this help message
	@echo "BETIM Docker Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development Commands
.PHONY: dev
dev: ## Start development environment
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

.PHONY: dev-build
dev-build: ## Build and start development environment
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

.PHONY: dev-down
dev-down: ## Stop development environment
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

.PHONY: dev-clean
dev-clean: ## Stop and remove development containers, networks, and volumes
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v

# Production Commands
.PHONY: prod
prod: ## Start production environment
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

.PHONY: prod-build
prod-build: ## Build production images
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

.PHONY: prod-down
prod-down: ## Stop production environment
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

.PHONY: prod-restart
prod-restart: ## Restart production services
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart

# Basic Commands
.PHONY: build
build: ## Build all Docker images
	docker-compose build

.PHONY: up
up: ## Start all services
	docker-compose up -d

.PHONY: down
down: ## Stop all services
	docker-compose down

.PHONY: restart
restart: ## Restart all services
	docker-compose restart

.PHONY: stop
stop: ## Stop all services
	docker-compose stop

.PHONY: start
start: ## Start all stopped services
	docker-compose start

# Logging Commands
.PHONY: logs
logs: ## View logs for all services
	docker-compose logs -f

.PHONY: logs-frontend
logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

.PHONY: logs-backend
logs-backend: ## View backend logs
	docker-compose logs -f backend

.PHONY: logs-db
logs-db: ## View database logs
	docker-compose logs -f postgres

# Database Commands
.PHONY: db-shell
db-shell: ## Access PostgreSQL shell
	docker-compose exec postgres psql -U betim -d betim_db

.PHONY: db-backup
db-backup: ## Backup database
	@mkdir -p backup
	docker-compose exec postgres pg_dump -U betim betim_db > backup/betim_db_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Database backed up to backup/betim_db_$$(date +%Y%m%d_%H%M%S).sql"

.PHONY: db-restore
db-restore: ## Restore database from backup (usage: make db-restore FILE=backup/betim_db_20240101_120000.sql)
	docker-compose exec -T postgres psql -U betim -d betim_db < $(FILE)
	@echo "Database restored from $(FILE)"

# Shell Access Commands
.PHONY: shell-frontend
shell-frontend: ## Access frontend container shell
	docker-compose exec frontend sh

.PHONY: shell-backend
shell-backend: ## Access backend container shell
	docker-compose exec backend sh

.PHONY: shell-db
shell-db: ## Access database container shell
	docker-compose exec postgres sh

# Utility Commands
.PHONY: ps
ps: ## List running containers
	docker-compose ps

.PHONY: clean
clean: ## Remove stopped containers and unused images
	docker system prune -f

.PHONY: clean-all
clean-all: ## Remove all containers, networks, volumes, and images
	docker-compose down -v --rmi all

.PHONY: volumes
volumes: ## List volumes
	docker volume ls | grep betim

.PHONY: networks
networks: ## List networks
	docker network ls | grep betim

# Testing Commands
.PHONY: test
test: ## Run all tests
	docker-compose exec frontend npm test
	# docker-compose exec backend npm test

.PHONY: test-frontend
test-frontend: ## Run frontend tests
	docker-compose exec frontend npm test

.PHONY: test-backend
test-backend: ## Run backend tests
	docker-compose exec backend npm test

# Build Commands for CI/CD
.PHONY: ci-build
ci-build: ## Build images for CI/CD
	docker build -t betim/frontend:$(VERSION) -f frontend/Dockerfile --target runner frontend/
	docker build -t betim/backend:$(VERSION) -f backend/Dockerfile backend/

.PHONY: push
push: ## Push images to registry (requires login)
	docker push betim/frontend:$(VERSION)
	docker push betim/backend:$(VERSION)

# Health Check Commands
.PHONY: health
health: ## Check health of all services
	@echo "Checking service health..."
	@docker-compose exec frontend wget --quiet --tries=1 --spider http://localhost:3000 && echo "✓ Frontend is healthy" || echo "✗ Frontend is unhealthy"
	@docker-compose exec backend wget --quiet --tries=1 --spider http://localhost:4000/health && echo "✓ Backend is healthy" || echo "✗ Backend is unhealthy"
	@docker-compose exec postgres pg_isready -U betim && echo "✓ Database is healthy" || echo "✗ Database is unhealthy"
	@docker-compose exec redis redis-cli ping > /dev/null 2>&1 && echo "✓ Redis is healthy" || echo "✗ Redis is unhealthy"

# Environment Setup
.PHONY: setup
setup: ## Initial setup - copy env file and build
	@if [ ! -f .env ]; then cp .env.example .env && echo "Created .env file from .env.example"; fi
	@echo "Building Docker images..."
	@make build
	@echo "Setup complete! Run 'make dev' to start development environment"

# Version Management
VERSION ?= latest

.PHONY: version
version: ## Show current version
	@echo "Current version: $(VERSION)"

# Docker Compose Version
.PHONY: compose-version
compose-version: ## Show Docker Compose version
	docker-compose version