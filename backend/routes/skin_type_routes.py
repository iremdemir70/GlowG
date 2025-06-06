from flask import Blueprint, request, jsonify
from flasgger import swag_from
import joblib
import pandas as pd
from models.skintone import SkinTone
from models.skintype import SkinType
from models.user import User
from database.db import db

skin_bp = Blueprint('skin_bp', __name__)


# GET /skin-types
@skin_bp.route('/skin-types', methods=['GET'])
def get_skin_types():
    types = SkinType.query.all()
    return jsonify([t.to_dict() for t in types])

# GET /skin-tones
@skin_bp.route('/skin-tones', methods=['GET'])
def get_skin_tones():
    tones = SkinTone.query.all()
    return jsonify([t.to_dict() for t in tones])

model, EXPECTED_COLUMNS, label_encoder = joblib.load('skintypeprediction.pkl')


CHOICE_MAP = {
    "Q1": {
        "a": "always (her zaman)",
        "b": "rarely (nadiren)",
        "c": "sometimes (ara sıra)",
        "d": "frequently (sıklıkla)"
    },
    "Q2": {
        "a": "always (her zaman)",
        "b": "often(sık sık)",
        "c": "occasionally (ara sıra)",
        "d": "never (hiçbir zaman)"
    },
    "Q3": {
        "a": "feel perfectly hydrated (mükemmel derecede nemlendirilmiş hissettiriyor)",
        "b": "feel greasy and sticky (yağlı ve yapışkan hissettiriyor)",
        "c": "feel oily in some areas but fine in others (bazı bölgelerde yağlı, bazılarında ise iyi hissediyorum)",
        "d": "absorb quickly without feeling greasy (yağlılık hissi bırakmadan hızla emiliyor)"
    },
    "Q4": {
        "a": "always (her zaman)",
        "b": "frequently (sıklıkla)",
        "c": "occasionally (ara sıra)",
        "d": "never (hiçbir zaman)"
    },
    "Q5": {
        "a": "feels perfectly balanced",
        "b": "feels dry or tight",
        "c": "feels normal in some areas but oily in the t-zone",
        "d": "feels greasy or shiny all over"
    },
    "Q6": {
        "a": "no noticeable change (gözle görülür bir değişiklik olmuyor)",
        "b": "feels drier in winter, normal in summer (kışın daha kuru, yazın ise normal)",
        "c": "feels normal in winter, oily in summer (kışın normal, yazın ise yağlı)",
        "d": "feels oily or greasy regardless of season (mevsim ne olursa olsun yağlı veya yapışkan)"
    },
    "Q7": {
        "a": "always (her zaman)",
        "b": "occasionally (ara sıra)",
        "c": "rarely (bazen)",
        "d": "never (hiçbir zaman)"
    },
    "Q8": {
        "a": "very oily throughout the day (gün boyunca çok yağlı)",
        "b": "slightly oily by the end of the day (günün sonunda biraz yağlı)",
        "c": "normal, neither oily nor dry (normal, ne yağlı ne de kuru)",
        "d": "dry or tight most of the time (çoğu zaman kuru veya sıkı)"
    }
}



@skin_bp.route('/predict-skintype', methods=['POST'])
@swag_from({
    'tags': ['SkinType Prediction'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'user_id': {'type': 'integer'},
                    'Q1': {'type': 'string'},
                    'Q2': {'type': 'string'},
                    'Q3': {'type': 'string'},
                    'Q4': {'type': 'string'},
                    'Q5': {'type': 'string'},
                    'Q6': {'type': 'string'},
                    'Q7': {'type': 'string'},
                    'Q8': {'type': 'string'}
                },
                'required': ['user_id', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Tahmin Başarılı',
            'examples': {
                'application/json': {'prediction': 'combination'}
            }
        },
        400: {'description': 'Eksik veri'},
        500: {'description': 'Sunucu hatası'}
    }
})
def predict_skin_type():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Eksik veri'}), 400

        user_id = data.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id gerekli'}), 400

        # Soruları ayıkla ve encode et
        question_answers = {k: v for k, v in data.items() if k.startswith('Q')}
        mapped_data = map_user_inputs(question_answers)
        user_df = pd.DataFrame([mapped_data])
        user_df_encoded = pd.get_dummies(user_df)

        # Eksik sütunları sıfırla
        for col in EXPECTED_COLUMNS:
            if col not in user_df_encoded.columns:
                user_df_encoded[col] = 0
        user_df_encoded = user_df_encoded[EXPECTED_COLUMNS]

        # Tahmin yap
        predicted_index = model.predict(user_df_encoded)[0]
        predicted_label = label_encoder.inverse_transform([predicted_index])[0]

        # Kullanıcıyı bul ve güncelle
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

        user.skin_type_id = int(predicted_index)
        db.session.commit()

        print("Toplam aktif feature sayısı:", user_df_encoded.sum().sum())
        print("Aktif olanlar:", user_df_encoded.loc[:, user_df_encoded.any()].columns.tolist())
        
        return jsonify({
            'prediction': predicted_label,
            'prediction_code': int(predicted_index),
            'updated_user_id': user_id
        })


    except Exception as e:
        return jsonify({'error': str(e)}), 500


def map_user_inputs(data):
    mapped_data = {}
    for question, answer in data.items():
        full_answer = CHOICE_MAP[question][answer].lower().strip()
        feature_name = f"{question}_{full_answer}"
        mapped_data[feature_name] = 1
    return mapped_data

