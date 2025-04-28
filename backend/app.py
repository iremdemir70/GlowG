from flask import Flask, request
from datetime import datetime
from flask_cors import CORS
from instance.config import Config
from database.db import db, bcrypt
from routes.auth_routes import auth_bp
from flasgger import Swagger
from routes.option_routes import options_bp
from mail_config import mail 
from flask import  jsonify
from flask_cors import CORS
from langchain_helper import get_product_ingredients
from routes.openai_routes import openai_bp
from apscheduler.schedulers.background import BackgroundScheduler
from models.product import Product
from routes.skin_type_routes import skin_bp


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])
swagger = Swagger(app)
app.register_blueprint(options_bp)
app.config.from_object(Config)
app.register_blueprint(openai_bp)
app.register_blueprint(skin_bp)
 # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://glowuser:irem123@localhost:5432/glowgenie'


#mail için gönderici adresi. değişebilir.
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'iremdemir440@gmail.com'  
app.config['MAIL_PASSWORD'] = 'fdjluczmrmwpommt'    


mail.init_app(app)
db.init_app(app)
bcrypt.init_app(app)
app.register_blueprint(auth_bp)
with app.app_context():
    db.create_all()
CORS(app)

@app.route('/')
def hello():
    return 'Hey!'

def delete_expired_products():
    now = datetime.now().strftime('%Y-%m-%d')
    expired = Product.query.filter(Product.expiration_date <= now).all()
    for product in expired:
        db.session.delete(product)
    db.session.commit()

scheduler = BackgroundScheduler()
scheduler.add_job(func=delete_expired_products, trigger="interval", hours=24)
scheduler.start()

if __name__ == '__main__':
    app.run()
