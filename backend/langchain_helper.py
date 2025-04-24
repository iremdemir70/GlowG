from openai import OpenAI

# OpenRouter client ayarı
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",  # buraya yeni aldığın OpenRouter API key
)

def get_product_ingredients(product_name):
    completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "http://localhost:3000",  # frontend URL'in burasıysa
            "X-Title": "GPT",  # Projenin adı
        },
        model="deepseek/deepseek-chat:free",
        messages=[
            {
                "role": "user",
                "content": f"List only the ingredients of the skincare product named '{product_name}'. Do not include explanations or descriptions."
            }
        ]
    )

    return completion.choices[0].message.content
