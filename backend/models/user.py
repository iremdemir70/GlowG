from database.db import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    skin_type_id = db.Column(db.Integer)
    skin_tone_id = db.Column(db.Integer)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)  

    def to_dict(self):
        return {
            'id': self.user_id,
            'email': self.email,
            'is_verified': self.is_verified  
        }
