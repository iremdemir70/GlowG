from database.db import db

class Category(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            "category_id": self.category_id,
            "category_name": self.category_name
        }
