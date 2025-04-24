from database.db import db
from models.product import Product
from datetime import datetime

def delete_expired_products():
    now = datetime.now().strftime('%Y-%m-%d')
    expired = Product.query.filter(Product.expiration_date <= now).all()
    for product in expired:
        db.session.delete(product)
    db.session.commit()
    print(f"{len(expired)} ürün silindi.")

# Bunu manuel çalıştırabilirsin veya APScheduler ile periyodik çalıştır
