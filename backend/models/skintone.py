from database.db import db

class SkinTone(db.Model):
    __tablename__ = 'skintones'
    tone_id = db.Column(db.Integer, primary_key=True)
    tone_name = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.tone_id,
            'name': self.tone_name
        }
