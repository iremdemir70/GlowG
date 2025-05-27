from flask import Blueprint, request, jsonify
from flasgger import swag_from
from database.db import db
from models.new_products import NewProduct
from langchain_helper import get_product_ingredients
from datetime import datetime, timedelta
from .ingredient_helpers import save_exist_ingredients

openai_bp = Blueprint('openai_bp', __name__)

@openai_bp.route('/predict-multiple', methods=['POST'])
@swag_from({
    'tags': ['AI Ingredients'],
    'summary': 'Get ingredients for multiple products using AI',
    'description': 'Accepts a list of products and returns AI-predicted ingredients. Skin type suitability is taken from provided skin_type_ids, not AI.',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'products': {
                        'type': 'array',
                        'items': {
                            'type': 'object',
                            'properties': {
                                'product_name': {'type': 'string'},
                                'category_id': {'type': 'integer'},
                                'brand': {'type': 'string'},
                                'skin_type_ids': {
                                    'type': 'array',
                                    'items': {'type': 'integer'},
                                    'description': 'List of skin type IDs (1: Dry, 2: Combination, 3: Normal, 4: Oily)'
                                }
                            },
                            'required': ['product_name', 'category_id', 'brand', 'skin_type_ids']
                        }
                    }
                },
                'required': ['products']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'AI-predicted ingredients and user-defined skin type suitability returned',
            'examples': {
                'application/json': {
                    'results': [
                        {
                            'product_name': 'Cleansing Foam',
                            'brand': 'La Mer',
                            'ingredients': ['Aqua', 'Glycerin'],
                            'suitable_for_ids': [1, 4]
                        }
                    ]
                }
            }
        },
        400: {'description': 'Invalid product list format'},
        500: {'description': 'Server error'}
    }
})
def predict_multiple():
    data = request.get_json()
    products = data.get("products", [])

    if not products or not isinstance(products, list):
        return jsonify({'error': 'products must be a list'}), 400

    results = []

    for product in products[:10]:
        product_name = product.get("product_name")
        category_id = product.get("category_id")
        brand = product.get("brand")
        skin_type_ids = product.get("skin_type_ids", [])

        if not product_name or not category_id or not brand or not isinstance(skin_type_ids, list):
            results.append({
                'product_name': product_name,
                'brand': brand,
                'error': 'Missing required fields or skin_type_ids must be a list'
            })
            continue

        existing = NewProduct.query.filter_by(product_name=product_name, category_id=category_id, brand=brand).first()

        if not existing:
            expiration_date = (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d')
            new_product = NewProduct(
                product_name=product_name,
                category_id=category_id,
                brand=brand,
                expiration_date=expiration_date
            )
            db.session.add(new_product)
            db.session.commit()
            db_product = new_product
        else:
            db_product = existing

        try:
            ai_data = get_product_ingredients(product_name)

            # Parse ingredients
            if isinstance(ai_data, str):
                lines = []
                for l in ai_data.split("\n"):
                    lines += [x.strip() for x in l.split(",") if x.strip()]
                ingredients = lines
            elif isinstance(ai_data, dict):
                ingredients = ai_data.get("ingredients", [])
            else:
                raise ValueError("Unexpected AI data format")

            # Save ingredients to DB
            save_exist_ingredients(db_product.product_id, ingredients)

            # Set skin type flags
            db_product.suitable_for_dry = 1 in skin_type_ids
            db_product.suitable_for_combination = 2 in skin_type_ids
            db_product.suitable_for_normal = 3 in skin_type_ids
            db_product.suitable_for_oily = 4 in skin_type_ids

            db.session.commit()

            results.append({
                'product_name': product_name,
                'brand': brand,
                'ingredients': ingredients,
                'suitable_for_ids': skin_type_ids
            })

        except Exception as e:
            results.append({
                'product_name': product_name,
                'brand': brand,
                'error': str(e)
            })

    return jsonify({'results': results})
