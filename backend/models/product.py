from database.db import db

class Product(db.Model):
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))
    expiration_date = db.Column(db.String)

    def to_dict(self):
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "category_id": self.category_id
        }
