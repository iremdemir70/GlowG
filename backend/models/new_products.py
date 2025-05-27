from database.db import db

class NewProduct(db.Model):
    __tablename__ = 'new_products'

    product_id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(255), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    category_id = db.Column(db.Integer, nullable=False)

    suitable_for_oily = db.Column(db.Boolean, default=False)
    suitable_for_dry = db.Column(db.Boolean, default=False)
    suitable_for_normal = db.Column(db.Boolean, default=False)
    suitable_for_combination = db.Column(db.Boolean, default=False)

    expiration_date = db.Column(db.Date, nullable=True)

