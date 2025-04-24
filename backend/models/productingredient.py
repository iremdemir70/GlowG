# models/productingredient.py

from database.db import db

class ProductIngredient(db.Model):
    __tablename__ = 'productingredients'
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'), primary_key=True)
