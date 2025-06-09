from flask import Blueprint, jsonify, request
from models.user import User
from flasgger import swag_from
from database.db import bcrypt, db
from flask import current_app
from flask_mail import Message
from mail_config import mail
import jwt
from datetime import datetime, timedelta
from functools import wraps


auth_bp = Blueprint('auth_bp', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            token = bearer.split(" ")[1] if " " in bearer else bearer

        if not token:
            return {'message': 'Token gerekli!'}, 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except jwt.ExpiredSignatureError:
            return {'message': 'Token süresi dolmuş!'}, 401
        except jwt.InvalidTokenError:
            return {'message': 'Token geçersiz!'}, 401

        return f(current_user, *args, **kwargs)
    return decorated

# get all user
@auth_bp.route('/users', methods=['GET'])
@token_required
@swag_from({
    'tags': ['User'],
    'responses': {
        200: {
            'description': 'Tüm kullanıcıları döndürür',
            'examples': {
                'application/json': [
                    {'id': 1, 'email': 'user1@mail.com'},
                    {'id': 2, 'email': 'user2@mail.com'}
                ]
            }
        }
    }
})
def get_users(current_user):
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


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
    allergens = data.get('allergens', [])

    if not email or not password:
        return {'message': 'Email ve şifre gerekli'}, 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        email=email,
        password=hashed_password,
        skin_type_id=skin_type_id,
        skin_tone_id=skin_tone_id,
        allergens=allergens
    )
    db.session.add(new_user)
    db.session.commit()

    # ✅ Email doğrulama token’ı oluştur
    verify_token = jwt.encode({
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=6)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")

    # ✅ Email gönder
    verify_link = f"http://127.0.0.1:5000/verify?token={verify_token}"
    msg = Message(
        subject="GlowGenie Hesabını Doğrula",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[email],
        body=f"Merhaba {email},\n\nLütfen hesabını doğrulamak için bu bağlantıya tıkla:\n{verify_link}"
    )
    mail.send(msg)

    return {'message': 'Kayıt başarılı, doğrulama maili gönderildi.'}, 201


@auth_bp.route('/verify', methods=['GET'])
def verify_email():
    token = request.args.get('token')
    if not token:
        return jsonify({"error": "Token bulunamadı"}), 400

    try:
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        email = data['email']
        user = User.query.filter_by(email=email).first()
        if user:
            user.is_verified = True
            db.session.commit()
            return jsonify({"message": f"{email} başarıyla doğrulandı!", "is_verified": user.is_verified})
        return jsonify({"error": "Kullanıcı bulunamadı"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token süresi dolmuş"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token geçersiz"}), 400


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
    if not user or not bcrypt.check_password_hash(user.password, password):
        return {'message': 'Email veya şifre hatalı'}, 401

    if not user.is_verified:
        return {'message': 'Lütfen hesabınızı doğrulayın.'}, 403

    token = jwt.encode({
        'user_id': user.user_id,
        'exp': datetime.utcnow() + timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    return {
        'message': 'Giriş başarılı',
        'token': token,
        'user_id': user.user_id
    }, 200

#UPDATE PROFILE
@auth_bp.route('/profile', methods=['PUT'])
@token_required
@swag_from({
    'tags': ['User'],
    'security': [{"Bearer": []}],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'skin_type_id': {'type': 'integer'},
                    'skin_tone_id': {'type': 'integer'},
                    'allergens': {
                        'type': 'array',
                        'items': {'type': 'string'}
                    }
                }
            }
        }
    ],
    'responses': {
        200: {'description': 'Profil başarıyla güncellendi'},
        400: {'description': 'Geçersiz veri'},
        401: {'description': 'Token eksik veya geçersiz'}
    }
})
def update_profile(current_user):
    data = request.get_json()

    if 'skin_type_id' in data:
        current_user.skin_type_id = data['skin_type_id']
    if 'skin_tone_id' in data:
        current_user.skin_tone_id = data['skin_tone_id']
    if 'allergens' in data:
        current_user.allergens = data['allergens']

    db.session.commit()

    return {
        'message': 'Profil başarıyla güncellendi',
        'updated_profile': current_user.to_dict()
    }, 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
@swag_from({
    'tags': ['User'],
    'security': [{"Bearer": []}],
    'responses': {
        200: {
            'description': 'Giriş yapan kullanıcının bilgileri',
            'examples': {
                'application/json': {
                    'user_id': 1,
                    'email': 'example@mail.com',
                    'skin_type_id': 2,
                    'skin_tone_id': 1,
                    'allergens': [],
                    'is_verified': True
                }
            }
        }
    }
})
def get_profile(current_user):
    return jsonify(current_user.to_dict()), 200


# forgot-password

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

    # Sadece email'i token içine koyuyoruz
    reset_token = jwt.encode({
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')

    reset_link = f"http://localhost:3000/reset-password?reset_token={reset_token}"

    msg = Message(
        subject="GlowGenie Password Reset",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[email],
        body=f"""Merhaba {email},

Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:

{reset_link}

Eğer bu isteği siz yapmadıysanız, bu mesajı yok sayabilirsiniz.
"""
    )
    try:
        mail.send(msg)
    except Exception as e:
        return jsonify({'error': 'Mail gönderilemedi', 'detail': str(e)}), 500

    return jsonify({'message': 'Sıfırlama bağlantısı gönderildi'}), 200


# reset password

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('reset_token')
    new_password = data.get('new_password')

    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        email = payload['email']

        user = User.query.filter_by(email=email).first()
        if user:
            user.password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            db.session.commit()
            return jsonify({'message': 'Şifre başarıyla güncellendi'}), 200
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token süresi dolmuş'}), 400
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Geçersiz token'}), 400
