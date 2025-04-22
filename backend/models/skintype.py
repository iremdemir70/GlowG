from database.db import db

class SkinType(db.Model):
    __tablename__ = 'skintypes'
    type_id = db.Column(db.Integer, primary_key=True)
    type_name = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.type_id,
            'name': self.type_name
        }
