from openai import OpenAI

# OpenRouter client ayarı
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",  # buraya yeni aldığın OpenRouter API key
)

def get_product_ingredients(product_name):
    completion = client.chat.completions.create(
        extra_headers={
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "GPT",
        },
        model="deepseek/deepseek-chat:free",
        messages=[
            {
                "role": "user",
                "content": (
                    f"List only the ingredient names of the skincare product named '{product_name}'.\n"
                    f"- Write each ingredient on a separate line.\n"
                    f"- Do not write any explanations, numbers, or extra symbols.\n"
                    f"- Do not write alternative names or combine names. For example, write 'Aqua' or 'Water', but NOT 'Aqua/Water' or 'Aqua (Water)'.\n"
                    f"- Do not use hyphens, bullets, or commas. Each line must contain only the single, pure ingredient name, like 'Glycerin', 'Aqua', 'Niacinamide', etc."
                )
            }
        ]
    )
    return completion.choices[0].message.content

