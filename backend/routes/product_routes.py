from flask import Blueprint, jsonify
from models.new_products import NewProduct
from models.category import Category
from flasgger import swag_from

product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/products', methods=['GET'])
@swag_from({
    'tags': ['Product'],
    'responses': {
        200: {
            'description': 'Tüm ürünleri döner',
            'examples': {
                'application/json': [
                    {
                        "product_id": 1,
                        "product_name": "Glow Wash",
                        "brand": "GlowGenie",
                        "category_id": 2,
                        "expiration_date": "2025-12-01"
                    }
                ]
            }
        }
    }
})
def get_products():
    products = NewProduct.query.all()
    return jsonify([p.to_str() for p in products])
