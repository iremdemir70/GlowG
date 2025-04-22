from flask import Flask, request
from datetime import datetime
from flask_cors import CORS
from instance.config import Config
from database.db import db, bcrypt
from routes.auth_routes import auth_bp
from flasgger import Swagger
from routes.option_routes import options_bp



app = Flask(__name__)
swagger = Swagger(app)
app.register_blueprint(options_bp)

app.config.from_object(Config)
 # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://glowuser:irem123@localhost:5432/glowgenie'

db.init_app(app)
bcrypt.init_app(app)
app.register_blueprint(auth_bp)
with app.app_context():
    db.create_all()
CORS(app)

@app.route('/')
def hello():
    return 'Hey!'


if __name__ == '__main__':
    app.run()
