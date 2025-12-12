# 📘 Semantic Search Engine

A high-performance **Semantic Search Engine** built with a Microservices Architecture.
Unlike traditional keyword search (which matches exact words), this engine understands the **meaning** of your query using AI embeddings.

It powers a "ChatGPT-like" retrieval system where you can store knowledge and ask questions about it in natural language.

---

## 🛠️ Technology Stack Deep Dive

This project integrates industry-standard tools used in production AI systems:

### 1️⃣ Frontend: **React + Vite**
- **Role**: The user interface for interacting with the system.
- **Key Features**:
    - **Modern UI**: Dark-themed, glassmorphic design.
    - **Fast Development**: Powered by Vite for instant HMR (Hot Module Replacement).
    - **Axios**: For making asynchronous HTTP requests to the backend services.

### 2️⃣ Backend: **FastAPI** (Python)
- **Role**: The high-speed API layer managing logic.
- **Microservices Setup**:
    - **Search Service**: The "Orchestrator". It handles user requests, coordinates with the database, and calls the embedding service.
    - **Embedding Service**: The "Brain". A dedicated service that only focuses on converting text into vectors.
- **Why FastAPI?**: It provides automatic Swagger documentation (`/docs`) and async support for high concurrency.

### 3️⃣ AI Model: **SentenceTransformers** (Hugging Face)
- **Model Used**: `all-MiniLM-L6-v2`
- **Role**: Converts text into a 384-dimensional vector (a list of floating-point numbers).
- **Why this model?**: It is lightweight, fast, and optimized for semantic similarity tasks.
- **How it works**: "Apple" and "Fruit" will have vectors close to each other, while "Apple" and "Car" will be far apart.

### 4️⃣ Vector Database: **Qdrant**
- **Role**: Specialized database for storing and searching high-dimensional vectors.
- **Why Qdrant?**:
    - Written in **Rust** for extreme performance.
    - Built-in **Cosine Similarity** search.
    - Stores both the **Vector** (for search) and **Payload** (original text) together.

### 5️⃣ Containerization: **Docker**
- **Role**: Enclosure ensuring the database runs consistently on any machine.
- **Usage**: We use Docker Compose to spin up Qdrant with persistent storage.

---

## � Architecture & Data Flow

```mermaid
graph TD
    User[User] -->|1. Enters Query| UI[React Frontend]
    
    subgraph "Backend Infrastructure"
        UI -->|2. POST /search| SearchAPI[Search Service (Port 8002)]
        
        SearchAPI -->|3. Request Embedding| EmbedAPI[Embedding Service (Port 8001)]
        EmbedAPI -->|4. Return Vector (384 floats)| SearchAPI
        
        SearchAPI -->|5. Vector Search (KNN)| Qdrant[Qdrant Vector DB (Port 6333)]
        Qdrant -->|6. Return Top Matches| SearchAPI
    end
    
    SearchAPI -->|7. Return Results JSON| UI
    UI -->|8. Display Cards| User
```

1.  **User Input**: User queries "What is semantic search?".
2.  **Vectorization**: The Embedding Service converts this question into a [0.12, -0.05, ...] vector.
3.  **Similarity Search**: Qdrant compares this vector against thousands of stored document vectors to find the nearest neighbors (Cosine Similarity).
4.  **Retrieval**: The original text of the nearest neighbors is returned to the user.

---

## ✨ Features Implemented

- **Dual-Service Backend**: Decoupled "Search" and "Compute" logic for scalability.
- **State-of-the-Art Search**: Uses `qdrant-client`'s `query_points` API for precise vector retrieval.
- **Persistent Storage**: Data survives restarts using Docker volumes mapped to `./qdrant_storage`.
- **Responsive UI**: Fully responsive grid layout that adapts to mobile and desktop screens.

---

## 🧪 How to Run

### Option 1: The Easy Way (Make)

We have automated everything with a `Makefile`.

1.  **Install Dependencies**:
    ```bash
    make install
    ```
2.  **Start Database**:
    ```bash
    make run-qdrant
    ```
3.  **Start Services** (In separate terminals):
    ```bash
    make run-embedding
    ```
    ```bash
    make run-search
    ```
    ```bash
    make run-frontend
    ```

### Option 2: Manual Setup

**1. Start Qdrant**
```bash
docker-compose up -d
```

**2. Start Embedding Service**
```bash
cd backend/embedding-service
uvicorn main:app --reload --port 8001
```

**3. Start Search Service**
```bash
cd backend/search-service
uvicorn main:app --reload --port 8002
```

**4. Start Frontend**
```bash
cd sementic-frontend
npm run dev
```

Visit: **http://localhost:5173**
