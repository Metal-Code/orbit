from mistralai import Mistral
from core.config import MISTRAL_API_KEY

client = Mistral(api_key=MISTRAL_API_KEY)

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="mistral-embed",
        inputs=[text]
    )
    return response.data[0].embedding