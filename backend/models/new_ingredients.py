from database.db import db

class NewIngredient(db.Model):
    __tablename__ = 'new_ingredients'
    
    ingredient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
