from models.product import Product
from models.ingredients import Ingredient
from models.productingredient import ProductIngredient
import pandas as pd
from database.db import db
import os

def save_ingredients_to_db(product_id, ingredients_list):
    ingredient_ids = []
    for ingredient_name in ingredients_list:
        # Ingredient yoksa ekle
        ingredient = Ingredient.query.filter_by(ingredient_name=ingredient_name).first()
        if not ingredient:
            ingredient = Ingredient(ingredient_name=ingredient_name)
            db.session.add(ingredient)
            db.session.commit()
        ingredient_ids.append(ingredient.ingredient_id)

        # productingredients bağlantısını ekle
        pi = ProductIngredient.query.filter_by(product_id=product_id, ingredient_id=ingredient.ingredient_id).first()
        if not pi:
            pi = ProductIngredient(product_id=product_id, ingredient_id=ingredient.ingredient_id)
            db.session.add(pi)
            db.session.commit()
    return ingredient_ids

def export_ingredients_to_csv(ingredients_list, product_name):
    import os
    import pandas as pd

    folder_path = "csv_files"
    os.makedirs(folder_path, exist_ok=True)  # Klasör yoksa oluştur

    filename = f"{product_name}_ingredients.csv".replace(" ", "_").lower()
    file_path = os.path.join(folder_path, filename)

    df = pd.DataFrame({"ingredient_name": ingredients_list})
    df.to_csv(file_path, index=False)
    return file_path  # <--- Tam dosya yolunu döndürür (ör: backend/csv_files/cerave_cleanser_ingredients.csv)

