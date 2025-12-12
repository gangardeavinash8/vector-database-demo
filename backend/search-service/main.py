from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from qdrant_client import QdrantClient
from qdrant_client.http import models
import uuid

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMBEDDING_URL = os.getenv("EMBEDDING_URL", "http://localhost:8001/embed")
QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
COLLECTION_NAME = "documents"

qdrant = QdrantClient(url=QDRANT_URL)

# Ensure collection exists
try:
    if not qdrant.collection_exists(COLLECTION_NAME):
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE)  
        )
except Exception as e:
    print(f"Error checking/creating collection: {e}")


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class AddDocumentRequest(BaseModel):
    text: str


@app.post("/add-document")
def add_document(req: AddDocumentRequest):
    # 1. Get embedding
    embed = requests.post(EMBEDDING_URL, json={"text": req.text}).json()["embedding"]

    # 2. Create point ID
    point_id = str(uuid.uuid4())

    # 3. Insert into Qdrant
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            models.PointStruct(
                id=point_id,
                vector=embed,
                payload={"text": req.text}
            )
        ]
    )

    return {"status": "success", "id": point_id, "text": req.text}


@app.post("/search")
def search(req: SearchRequest):

    #  Get embedding from embedding-service
    emb_res = requests.post(EMBEDDING_URL, json={"text": req.query})
    embedding = emb_res.json()["embedding"]

    # 2 Perform vector search
    result = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=embedding,
        limit=req.top_k
    )

    #  Format result
    output = []
    for point in result.points:
        output.append({
            "id": point.id,
            "score": point.score,
            "text": point.payload.get("text")
        })

    return {"results": output}
