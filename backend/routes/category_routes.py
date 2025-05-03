# routes/category_routes.py

from flask import Blueprint, jsonify
from models.category import Category
from flasgger import swag_from

category_bp = Blueprint('category_bp', __name__)

@category_bp.route('/categories', methods=['GET'])
@swag_from({
    'tags': ['Category'],
    'responses': {
        200: {
            'description': 'Tüm kategorileri döner',
            'examples': {
                'application/json': [
                    {"category_id": 1, "category_name": "Cleanser"},
                    {"category_id": 2, "category_name": "Moisturizer"}
                ]
            }
        }
    }
})
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])
