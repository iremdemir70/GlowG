from database.db import db

class NewExistingIngredient(db.Model):
    __tablename__ = 'new_existing_ingredients'

    product_id = db.Column(db.Integer, db.ForeignKey('new_products.product_id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('new_ingredients.ingredient_id'), primary_key=True)
    is_exist = db.Column(db.Boolean, nullable=False)

    product = db.relationship('NewProduct', backref=db.backref('ingredients_link', cascade='all, delete-orphan'))
    ingredient = db.relationship('NewIngredient', backref=db.backref('products_link', cascade='all, delete-orphan'))
