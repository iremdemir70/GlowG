from flask import Blueprint, jsonify
from models.skintype import SkinType
from models.skintone import SkinTone

options_bp = Blueprint('options_bp', __name__)

@options_bp.route('/skintypes', methods=['GET'])
def get_skin_types():
    """
    Tüm cilt tiplerini getirir
    ---
    tags:
      - SkinType
    responses:
      200:
        description: Skin type listesi
        examples:
          application/json: [
            {"id": 1, "name": "Oily"},
            {"id": 2, "name": "Dry"}
          ]
    """
    types = SkinType.query.all()
    return jsonify([t.to_dict() for t in types])

@options_bp.route('/skintones', methods=['GET'])
def get_skin_tones():
    """
    Tüm cilt tonlarını getirir
    ---
    tags:
      - SkinTone
    responses:
      200:
        description: Skin tone listesi
        examples:
          application/json: [
            {"id": 1, "name": "Light"},
            {"id": 2, "name": "Medium"}
          ]
    """
    tones = SkinTone.query.all()
    return jsonify([t.to_dict() for t in tones])
