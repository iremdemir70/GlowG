from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from

from models.product import Product
from models.category import Category
from models.user import User
from database.db import db  # db.session.commit için gerekli

product_bp = Blueprint('product_bp', __name__)

# --- GET ALL PRODUCTS ---
@product_bp.route('/products', methods=['GET'])
@swag_from({
    'tags': ['Product'],
    'responses': {
        200: {
            'description': 'Tüm ürünleri döner',
            'examples': {
                'application/json': [
                    {"product_id": 1, "product_name": "Glow Wash", "category_id": 2, "expiration_date": "2025-12-01"}
                ]
            }
        }
    }
})
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

# --- UPDATE SUITABLE_FOR (Admin Only) ---
@product_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
@swag_from({
    'tags': ['Product'],
    'parameters': [
        {
            'name': 'product_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'Güncellenecek ürünün ID\'si'
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'suitable_for': {
                        'type': 'array',
                        'items': {'type': 'integer'},
                        'description': 'Ürünün uygun olduğu skin_type_id listesi'
                    }
                },
                'required': ['suitable_for']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Ürün başarıyla güncellendi',
            'examples': {'application/json': {'message': 'Product updated'}}
        },
        403: {
            'description': 'Yetki yok',
            'examples': {'application/json': {'message': 'Permission denied'}}
        },
        404: {
            'description': 'Ürün bulunamadı',
            'examples': {'application/json': {'message': 'Product not found'}}
        }
    }
})
def update_product(product_id):
    current_user_identity = get_jwt_identity()
    user = User.query.filter_by(email=current_user_identity).first()

    if not user or not user.is_admin:
        return jsonify({"message": "Permission denied"}), 403

    data = request.get_json()
    suitable_for = data.get("suitable_for", [])

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    product.suitable_for = suitable_for
    db.session.commit()
    return jsonify({"message": "Product updated"}), 200
