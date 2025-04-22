# services/auth_service.py
from database.db import db
from models.user import User

def get_all_users():
    """
    Returns a list of all User objects from the database.
    """
    return User.query.all()
