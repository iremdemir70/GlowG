from database.db import db
from sqlalchemy.dialects.postgresql import ARRAY
from models.skintype import SkinType
from models.skintone import SkinTone

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    skin_type_id = db.Column(db.Integer, db.ForeignKey('skintypes.type_id'))
    skin_tone_id = db.Column(db.Integer, db.ForeignKey('skintones.tone_id'))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    allergens = db.Column(ARRAY(db.Text)) 

    def to_dict(self):
        skin_type = SkinType.query.get(self.skin_type_id)
        skin_tone = SkinTone.query.get(self.skin_tone_id)

        return {
            'id': self.user_id,
            'email': self.email,
            'is_verified': self.is_verified,
            'allergens': self.allergens,
            'skin_type_name': skin_type.type_name if skin_type else None,
            'skin_tone_name': skin_tone.tone_name if skin_tone else None
        }

