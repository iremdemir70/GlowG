# routes/product_routes.py içinde
from flask import request
from models.product import Product
from models.category import Category
from models.user import User
from models.ingredients import Ingredient  
from database.db import db
from flask import Blueprint, jsonify
from auth_routes import token_required
product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/suggest-products', methods=['POST'])
@token_required
def suggest_products(current_user):
    data = request.get_json()
    selected_categories = data.get('categories', [])

    if not current_user.skin_type_id:
        return jsonify({"error": "Skin type not set for user."}), 400

    # Kategori ID'leri bulunur
    category_objs = Category.query.filter(Category.category_name.in_(selected_categories)).all()
    category_ids = [c.category_id for c in category_objs]

    # İlgili ürünler çekilir
    products = Product.query.filter(Product.category_id.in_(category_ids)).all()

    # Her kategori için grupla
    results = {}
    for cat in category_objs:
        results[cat.category_name] = []

    for product in products:
        category_name = next((c.category_name for c in category_objs if c.category_id == product.category_id), None)
        if category_name:
            results[category_name].append({
                "name": product.product_name,
                "ingredients": ["placeholder"],  # burayı ilişkilendireceksen ingredient join yapılabilir
                "suitable": True,  # şimdilik mock değer, ileride cilt tipi uyumluluğu analizi yapabilirsin
                "reason": f"Placeholder reason for {product.product_name}"
            })

    return jsonify(results), 200
