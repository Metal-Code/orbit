import chromadb
import json
from rag.embedder import get_embedding

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="timeline_entries")

def add_entry_to_vector_store(entry_id: int, project_id: int, text: str, title: str, links: list, attachments: list):
    embedding = get_embedding(text)
    collection.add(
        ids=[str(entry_id)],
        embeddings=[embedding],
        metadatas=[{
            "project_id": project_id,
            "title": title,
            "links": json.dumps(links),
            "attachments": json.dumps(attachments)
        }],
        documents=[text]
    )

def query_vector_store(question: str, project_id: int, top_k: int = 5, max_distance: float = 0.8):
    embedding = get_embedding(question)
    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where={"project_id": project_id}
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    ids = results.get("ids", [[]])[0]
    distances = results.get("distances", [[]])[0]

    print(f"\n--- QUERY: '{question}' ---")
    for i in range(len(documents)):
        print(f"  distance={distances[i]:.4f}  title={metadatas[i].get('title','')}")

    entries = []
    for i in range(len(documents)):
        if distances[i] > max_distance:
            continue
        entries.append({
            "entry_id": int(ids[i]),
            "text": documents[i],
            "title": metadatas[i].get("title", ""),
            "links": json.loads(metadatas[i].get("links", "[]")),
            "attachments": json.loads(metadatas[i].get("attachments", "[]"))
        })

    return entries

def delete_entry_from_vector_store(entry_id: int):
    collection.delete(ids=[str(entry_id)])