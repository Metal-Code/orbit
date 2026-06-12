import chromadb
from rag.embedder import get_embedding

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="timeline_entries")

def add_entry_to_vector_store(entry_id: int, project_id: int, text: str):
    embedding = get_embedding(text)
    collection.add(
        ids=[str(entry_id)],
        embeddings=[embedding],
        metadatas=[{"project_id": project_id}],
        documents=[text]
    )

def query_vector_store(question: str, project_id: int, top_k: int = 5):
    embedding = get_embedding(question)
    results = collection.query(
        query_embeddings=[embedding],
        n_results=top_k,
        where={"project_id": project_id}
    )
    documents = results.get("documents", [[]])[0]
    return documents

def delete_entry_from_vector_store(entry_id: int):
    collection.delete(ids=[str(entry_id)])