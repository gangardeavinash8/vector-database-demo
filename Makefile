.PHONY: help install run-qdrant run-embedding run-search stop-qdrant

help:
	@echo "Available commands:"
	@echo "  make install         - Install dependencies for both services"
	@echo "  make run-qdrant      - Start Qdrant vector database (Docker)"
	@echo "  make stop-qdrant     - Stop Qdrant vector database"
	@echo "  make run-embedding   - Start Embedding Service (Port 8001)"
	@echo "  make run-search      - Start Search Service (Port 8002)"
	@echo "  make run-frontend    - Start React Frontend"

install:
	pip install -r backend/embedding-service/requirements.txt
	pip install -r backend/search-service/requirements.txt
	cd sementic-frontend && npm install

run-qdrant:
	docker-compose up -d
	@echo "Qdrant started on port 6333"

stop-qdrant:
	docker-compose down

run-embedding:
	cd backend/embedding-service && uvicorn main:app --reload --port 8001

run-search:
	cd backend/search-service && uvicorn main:app --reload --port 8002

run-frontend:
	cd sementic-frontend && npm run dev
