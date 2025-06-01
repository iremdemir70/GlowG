from models.skintype import SkinType 
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from database.db import db
from models.product import Product
from langchain_helper import get_product_ingredients
from datetime import datetime, timedelta
from .ingredient_helpers import save_exist_ingredients
from ml.ml_predictor import predict_suitability
from models.user import User
from routes.auth_routes import token_required

openai_bp = Blueprint('openai_bp', __name__)

@openai_bp.route('/predict', methods=['POST'])
@token_required
@swag_from({
    'tags': ['AI Ingredients'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'product_name': {'type': 'string'},
                    'category_id': {'type': 'integer'}
                },
                'required': ['product_name', 'category_id']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Ingredient listesi başarıyla döndü',
            'examples': {
                'application/json': {
                    'ingredients': ['Aqua', 'Glycerin', 'Ceramide NP'],
                    'suitability': {
                        'skin_type': 'KURU',
                        'probability': 0.782,
                        'label': 'Suitable'
                    }
                }
            }
        },
        400: {'description': 'Eksik veri'},
        500: {'description': 'Sunucu hatası'}
    }
})
def predict(current_user): 
    data = request.get_json()
    product_name = data.get("product_name")
    category_id = data.get("category_id")

    if not product_name or not category_id:
        return jsonify({'error': 'product_name ve category_id gerekli'}), 400

    existing = Product.query.filter_by(product_name=product_name, category_id=category_id).first()

    if not existing:
        now = datetime.now()
        expiration_date = (now + timedelta(days=60)).strftime('%Y-%m-%d')
        new_product = Product(
            product_name=product_name,
            category_id=category_id,
            expiration_date=expiration_date
        )
        db.session.add(new_product)
        db.session.commit()
        product_id = new_product.product_id
    else:
        product_id = existing.product_id

    try:
        response = get_product_ingredients(product_name)
        lines = []
        for l in response.split("\n"):
            lines += [x.strip() for x in l.split(",") if x.strip()]
        
        save_exist_ingredients(product_id, lines)

        user = current_user

        skin_type = SkinType.query.get(user.skin_type_id)
        if not skin_type or not skin_type.type_name:
            return jsonify({'error': 'Kullanıcının cilt tipi tanımlı değil'}), 400

        english_to_turkish = {
            "OILY": "YAGLI",
            "OILY SKIN": "YAGLI",
            "DRY": "KURU",
            "DRY SKIN": "KURU",
            "COMBINATION": "KARMA",
            "COMBINATION SKIN": "KARMA",
            "NORMAL": "NORMAL",
            "NORMAL SKIN": "NORMAL"
        }

        mapped = english_to_turkish.get(skin_type.type_name.upper().strip())
        if not mapped:
            return jsonify({'error': f"No model for skin type: {skin_type.type_name}"}), 400

        prob, label = predict_suitability(product_id, mapped)

        return jsonify({
            'ingredients': lines,
            'suitability': {
                'skin_type': skin_type.type_name,
                'probability': prob,
                'label': label
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
