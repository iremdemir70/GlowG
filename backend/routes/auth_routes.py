from flask import Blueprint, jsonify, request
from models.user import User
from flasgger import swag_from
from database.db import bcrypt, db

auth_bp = Blueprint('auth_bp', __name__)

# get all user
@auth_bp.route('/users', methods=['GET'])
@swag_from({
    'tags': ['User'],
    'responses': {
        200: {
            'description': 'Tüm kullanıcıları veritabanından döndürür',
            'examples': {
                'application/json': [
                    {'id': 1, 'email': 'user1@mail.com'},
                    {'id': 2, 'email': 'user2@mail.com'}
                ]
            }
        }
    }
})
def get_users():
    users = User.query.all()
    user_list = [user.to_dict() for user in users]
    return jsonify(user_list)



# register user
@auth_bp.route('/register', methods=['POST'])
@swag_from({
    'tags': ['Auth'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'email': {'type': 'string'},
                    'password': {'type': 'string'},
                    'skin_type_id': {'type': 'integer'},
                    'skin_tone_id': {'type': 'integer'},
                },
                'required': ['email', 'password']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'Kullanıcı başarıyla oluşturuldu'
        },
        400: {
            'description': 'Eksik ya da hatalı veri'
        }
    }
})
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    skin_type_id = data.get('skin_type_id')
    skin_tone_id = data.get('skin_tone_id')

    if not email or not password:
        return {'message': 'Email ve şifre gerekli'}, 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        email=email,
        password=hashed_password,
        skin_type_id=skin_type_id,
        skin_tone_id=skin_tone_id
    )
    db.session.add(new_user)
    db.session.commit()

    return {'message': 'Kayıt başarılı'}, 201