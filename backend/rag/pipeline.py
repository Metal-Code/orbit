from rag.retriever import retrieve_relevant_entries
from rag.llm import generate_answer

def answer_question(question: str, project_id: int) -> dict:
    context_entries = retrieve_relevant_entries(question, project_id)
    answer = generate_answer(question, context_entries)

    no_info_phrases = [
        "you're welcome", "no problem", "glad i could help", "happy to help",
        "don't see relevant", "don't see any relevant", "no relevant information",
        "no timeline entries", "doesn't contain relevant", "i don't have",
        "not enough information", "no information available"
    ]
    is_no_info = any(phrase in answer.lower() for phrase in no_info_phrases)

    sources = []
    if not is_no_info:
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