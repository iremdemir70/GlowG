from flask import Flask, request, jsonify
from datetime import datetime
from flask_cors import CORS
from flask_mail import Mail
from instance.config import Config
from database.db import db, bcrypt
from flasgger import Swagger
from apscheduler.schedulers.background import BackgroundScheduler

# Route dosyaları
from routes.option_routes import options_bp
from routes.openai_routes import openai_bp
from routes.skin_type_routes import skin_bp
from routes.product_routes import product_bp
from routes.category_routes import category_bp
from routes.auth_routes import auth_bp

from models.product import Product

app = Flask(__name__)
app.config.from_object(Config)

# 🔐 Secret Key
app.config['SECRET_KEY'] = 'glowgenie-süper-gizli-anahtar'

# ✅ CORS ayarı (tek satır yeterli)
CORS(app, origins=["http://localhost:3000"])

# ✅ Mail ayarları
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'iremdemir440@gmail.com'
app.config['MAIL_PASSWORD'] = 'fdjluczmrmwpommt'

mail = Mail(app)

# ✅ JWT destekli Swagger yapılandırması
swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "GlowGenie API",
        "description": "JWT korumalı API",
        "version": "1.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "JWT Token giriniz. Örn: Bearer eyJ..."
        }
    },
    "security": [{"Bearer": []}]
}
swagger = Swagger(app, template=swagger_template)

# ✅ Init işlemleri
mail.init_app(app)
db.init_app(app)
bcrypt.init_app(app)

# ✅ Blueprint'leri bağla
app.register_blueprint(options_bp)
app.register_blueprint(openai_bp)
app.register_blueprint(skin_bp)
app.register_blueprint(product_bp)
app.register_blueprint(category_bp)
app.register_blueprint(auth_bp)

# ✅ DB tabloları oluştur
with app.app_context():
    db.create_all()

# ✅ Ana rota
@app.route('/')
def hello():
    return 'Hey GlowGenie!'

# ✅ Arka planda çalışan görev: Süresi geçmiş ürünleri sil
def delete_expired_products():
    now = datetime.now().strftime('%Y-%m-%d')
    expired = Product.query.filter(Product.expiration_date <= now).all()
    for product in expired:
        db.session.delete(product)
    db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(func=delete_expired_products, trigger="interval", hours=24)
scheduler.start()

# ✅ Çalıştır
if __name__ == '__main__':
    app.run()
