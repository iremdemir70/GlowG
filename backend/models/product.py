from database.db import db

class Product(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    category_id = db.Column(db.Integer)  # veya FK
    expiration_date = db.Column(db.String)
