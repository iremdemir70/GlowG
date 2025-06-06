from models.ingredients import Ingredient
from models.exist_ingredients import ExistIngredient
from database.db import db

def normalize_ingredient(name):
    return name.lower().strip().replace("-", " ").replace("/", " ")

def save_exist_ingredients(product_id, product_ingredients):
    normalized_input = [normalize_ingredient(i) for i in product_ingredients]
    critical_ingredients = Ingredient.query.all()

    for crit in critical_ingredients:
        crit_name_norm = normalize_ingredient(crit.ingredient_name)

        is_exist = int(crit_name_norm in normalized_input)

        exist = ExistIngredient.query.filter_by(product_id=product_id, ingredient_id=crit.ingredient_id).first()
        if not exist:
            exist = ExistIngredient(
                product_id=product_id,
                ingredient_id=crit.ingredient_id,
                is_exist=is_exist
            )
            db.session.add(exist)
        else:
            exist.is_exist = is_exist  

    db.session.commit()

# def export_ingredients_to_csv(ingredients_list, product_name):
#     import os
#     import pandas as pd

#     folder_path = "csv_files"
#     os.makedirs(folder_path, exist_ok=True)

#     filename = f"{product_name}_ingredients.csv".replace(" ", "_").lower()
#     file_path = os.path.join(folder_path, filename)

#     df = pd.DataFrame({"ingredient_name": ingredients_list})
#     df.to_csv(file_path, index=False)
#     return file_path
