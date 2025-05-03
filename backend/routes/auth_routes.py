from flask import Blueprint, jsonify, request
from models.user import User
from flasgger import swag_from
from database.db import bcrypt, db
from flask import current_app
from flask_mail import Message
from mail_config import mail

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


# GET user by ID
@auth_bp.route('/users/<int:user_id>', methods=['GET'])
@swag_from({
    'tags': ['User'],
    'parameters': [
        {
            'name': 'user_id',
            'in': 'path',
            'type': 'integer',
            'required': True,
            'description': 'Kullanıcının ID değeri'
        }
    ],
    'responses': {
        200: {
            'description': 'Kullanıcı bilgileri başarıyla döndürüldü'
        },
        404: {
            'description': 'Kullanıcı bulunamadı'
        }
    }
})
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"message": "User not found"}), 404


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
                    'allergens': {
                        'type': 'array',
                        'items': {'type': 'string'}
                    }
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
    allergens = data.get('allergens', [])  # 👈 varsayılan boş liste

    if not email or not password:
        return {'message': 'Email ve şifre gerekli'}, 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        email=email,
        password=hashed_password,
        skin_type_id=skin_type_id,
        skin_tone_id=skin_tone_id,
        allergens=allergens  # 👈 yeni alan
    )
    db.session.add(new_user)
    db.session.commit()

    # Doğrulama maili gönder
    msg = Message(
        subject="GlowGenie Hesabını Doğrula",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[email],
        body=f"Merhaba {email},\n\nLütfen hesabını doğrulamak için şu bağlantıya tıkla:\nhttp://127.0.0.1:5000/verify/{email}"
    )
    mail.send(msg)

    return {'message': 'Kayıt başarılı'}, 201



@auth_bp.route('/verify/<path:email>', methods=['GET'])
def verify_email(email):
    import urllib.parse
    decoded_email = urllib.parse.unquote(email)
    print("GELEN EMAIL:", email)
    print("DECODE EDİLMİŞ EMAIL:", decoded_email)
    user = User.query.filter_by(email=decoded_email).first()
    print("BULUNAN USER:", user)
    if user:
        user.is_verified = True
        db.session.commit()
        print("SONUÇ -> is_verified:", user.is_verified)
        return jsonify({"message": f"{decoded_email} başarıyla doğrulandı!", "is_verified": user.is_verified})
    print("KULLANICI BULUNAMADI!")
    return jsonify({"error": "Kullanıcı bulunamadı"}), 404


# login user
@auth_bp.route('/login', methods=['POST'])
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
                },
                'required': ['email', 'password']
            }
        }
    ],
    'responses': {
        200: {'description': 'Giriş başarılı'},
        401: {'description': 'Geçersiz kimlik bilgileri'},
        403: {'description': 'Hesap doğrulanmamış'}
    }
})
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user:
        return {'message': 'Geçersiz email veya şifre'}, 401

    if not bcrypt.check_password_hash(user.password, password):
        return {'message': 'Geçersiz email veya şifre'}, 401

    if not user.is_verified:
        return {
            'message': 'Lütfen mailinize gelen onay bağlantısını tıklayarak hesabınızı doğrulayın.'
        }, 403

    return {'message': 'Giriş başarılı', 'user_id': user.user_id}, 200
