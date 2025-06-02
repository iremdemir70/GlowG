# models/product.py

from database.db import db

class Product(db.Model):
    __tablename__ = 'products'

    product_id       = db.Column(db.Integer, primary_key=True)
    product_name     = db.Column(db.String,  nullable=False)
    category_id      = db.Column(db.Integer, db.ForeignKey('categories.category_id'))
    expiration_date  = db.Column(db.String)

    # --- Yeni eklenen sütunlar ---
    # Cilt tipine uygunluk flag’leri (Boolean)
    is_dry           = db.Column(db.Boolean, default=False, nullable=False)
    is_oily          = db.Column(db.Boolean, default=False, nullable=False)
    is_combination   = db.Column(db.Boolean, default=False, nullable=False)
    is_normal        = db.Column(db.Boolean, default=False, nullable=False)

    # SHAP açıklamalarını tutacak Text alanları
    shap_dry         = db.Column(db.Text,    nullable=True)
    shap_oily        = db.Column(db.Text,    nullable=True)
    shap_combination = db.Column(db.Text,    nullable=True)
    shap_normal      = db.Column(db.Text,    nullable=True)

    def to_dict(self):
        return {
            "product_id":       self.product_id,
            "product_name":     self.product_name,
            "category_id":      self.category_id,
            "expiration_date":  self.expiration_date,
            "is_dry":           self.is_dry,
            "is_oily":          self.is_oily,
            "is_combination":   self.is_combination,
            "is_normal":        self.is_normal,
            "shap_dry":         self.shap_dry,
            "shap_oily":        self.shap_oily,
            "shap_combination": self.shap_combination,
            "shap_normal":      self.shap_normal
        }
