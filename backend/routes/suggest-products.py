# routes/product_routes.py içinde
from flask import request
from backend.models.skintype import SkinType
from models.product import Product
from models.category import Category
from models.user import User
from models.ingredients import Ingredient  
from database.db import db
from flask import Blueprint, jsonify
from auth_routes import token_required
from flask_cors import cross_origin

product_bp = Blueprint('product_bp', __name__)

@product_bp.route('/suggest-products', methods=['POST', 'OPTIONS'])  # <-- BUNA DİKKAT
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@token_required
def suggest_products(current_user):
    if request.method == 'OPTIONS':
        return '', 200  # Preflight için 200 OK dön
    
    data = request.get_json()
    selected_categories = data.get('categories', [])
    skin_type_name = data.get('skin_type_name', '').upper().strip()

    if not selected_categories or not skin_type_name:
        return jsonify({"error": "Eksik veri: kategori veya cilt tipi"}), 400

    skin_flag_map = {
        "KURU": "is_dry",
        "YAGLI": "is_oily",
        "KARMA": "is_combination",
        "NORMAL": "is_normal"
    }
    skin_flag = skin_flag_map.get(skin_type_name)
    if not skin_flag:
        return jsonify({"error": "Desteklenmeyen cilt tipi"}), 400

    category_objs = Category.query.filter(Category.category_name.in_(selected_categories)).all()
    category_ids = [c.category_id for c in category_objs]

    products = Product.query.filter(
        Product.category_id.in_(category_ids),
        getattr(Product, skin_flag) == True
    ).all()

    results = {cat.category_name: [] for cat in category_objs}

    for product in products:
        cat_name = next((c.category_name for c in category_objs if c.category_id == product.category_id), None)
        if cat_name:
            results[cat_name].append({
                "name": product.product_name,
                "ingredients": ["placeholder"],
                "suitable": True,
                "reason": f"{skin_type_name.title()} cilt için önerildi."
            })

    return jsonify(results), 200

