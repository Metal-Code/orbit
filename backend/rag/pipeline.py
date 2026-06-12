from rag.retriever import retrieve_relevant_entries
from rag.llm import generate_answer

def answer_question(question: str, project_id: int) -> str:
    context_entries = retrieve_relevant_entries(question, project_id)
    answer = generate_answer(question, context_entries)
    return answer