from flask import Blueprint, request, jsonify
from flasgger import swag_from
from database.db import db
from models.product import Product
from langchain_helper import get_product_ingredients
from datetime import datetime, timedelta
from .ingredient_helpers import save_exist_ingredients
from ml.ml_predictor import predict_suitability
from models.user import User

openai_bp = Blueprint('openai_bp', __name__)

@openai_bp.route('/predict', methods=['POST'])
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
def predict():
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

        # ML ENTEGRASYONU BAŞLANGIÇ 🔽
        user = User.query.filter_by(user_id=1).first()  # kendi sistemine göre user_id'yi değiştir
        if not user or not user.skin_type:
            return jsonify({'error': 'Kullanıcının cilt tipi bulunamadı'}), 400

        prob, label = predict_suitability(product_id, user.skin_type.upper())
        # ML ENTEGRASYONU BİTİŞ 🔼

        return jsonify({
            'ingredients': lines,
            'suitability': {
                'skin_type': user.skin_type,
                'probability': prob,
                'label': label
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
