from mistralai import Mistral
from core.config import MISTRAL_API_KEY

client = Mistral(api_key=MISTRAL_API_KEY)

def generate_answer(question: str, context_entries: list[str]) -> str:
    if not context_entries:
        context_text = "No timeline entries found for this project yet."
    else:
        context_text = "\n\n".join([f"- {entry}" for entry in context_entries])

    prompt = f"""You are an assistant for a software project's timeline. Answer the user's question based only on the following project timeline entries. Be concise and helpful. If the entries don't contain relevant information, say so honestly.

Project Timeline Entries:
{context_text}

Question: {question}

Answer:"""

    response = client.chat.complete(
        model="mistral-small-latest",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content