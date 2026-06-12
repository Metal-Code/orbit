from rag.retriever import retrieve_relevant_entries
from rag.llm import generate_answer

def answer_question(question: str, project_id: int) -> dict:
    context_entries = retrieve_relevant_entries(question, project_id)
    answer = generate_answer(question, context_entries)

    sources = []
    for entry in context_entries:
        if entry["links"] or entry["attachments"]:
            sources.append({
                "entry_id": entry["entry_id"],
                "title": entry["title"],
                "links": entry["links"],
                "attachments": entry["attachments"]
            })

    return {
        "answer": answer,
        "sources": sources
    }