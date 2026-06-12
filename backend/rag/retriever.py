from rag.vector_store import query_vector_store

def retrieve_relevant_entries(question: str, project_id: int) -> list[str]:
    return query_vector_store(question, project_id)