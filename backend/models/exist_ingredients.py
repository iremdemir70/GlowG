from database.db import db

class ExistIngredient(db.Model):
    __tablename__ = 'exist_ingredients'
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'), primary_key=True)
    is_exist = db.Column(db.Boolean, nullable=False)
