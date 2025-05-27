from models.new_ingredients import NewIngredient
from models.new_existing_ingredients import NewExistingIngredient
from database.db import db

def save_exist_ingredients(product_id, product_ingredients):
    """
    product_id: int, the ID of the product being saved
    product_ingredients: list, cleaned ingredient names returned from AI
    """
    # Get all ingredients we track in the system
    critical_ingredients = NewIngredient.query.all()

    for crit in critical_ingredients:
        is_exist = int(any(
            crit.name.lower() == i.lower() for i in product_ingredients
        ))
        
        exist = NewExistingIngredient.query.filter_by(
            product_id=product_id,
            ingredient_id=crit.ingredient_id
        ).first()

        if not exist:
            exist = NewExistingIngredient(
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
