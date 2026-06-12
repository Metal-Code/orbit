from mistralai import Mistral
from core.config import MISTRAL_API_KEY

client = Mistral(api_key=MISTRAL_API_KEY)

def generate_answer(question: str, context_entries: list[dict]) -> str:
    if not context_entries:
        context_text = "No timeline entries found for this project yet."
    else:
        context_text = "\n\n".join([f"- {entry['text']}" for entry in context_entries])

    prompt = f"""You are an assistant for a software project's timeline. Answer the user's question based only on the following project timeline entries. Be concise and helpful.

Do NOT include raw URLs or list attachment/link names in your answer text — these will be displayed separately as clickable elements. Just answer naturally, e.g. "Yes, this entry has an attached image and a link" without listing the actual URLs or file names.

If the entries don't contain relevant information, say so honestly.

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