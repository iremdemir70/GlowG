from flask import Blueprint, request, jsonify
from flasgger import swag_from
import joblib
import pandas as pd

skin_bp = Blueprint('skin_bp', __name__)

# Modeli yükle
model, EXPECTED_COLUMNS = joblib.load('skintypeprediction.pkl')


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
                    'Q1': {'type': 'string'},
                    'Q2': {'type': 'string'},
                    'Q3': {'type': 'string'},
                    'Q4': {'type': 'string'},
                    'Q5': {'type': 'string'},
                    'Q6': {'type': 'string'},
                    'Q7': {'type': 'string'},
                    'Q8': {'type': 'string'}
                },
                'required': ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Tahmin Başarılı',
            'examples': {
                'application/json': {'prediction': 2}
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

        # 👇👇👇 BURASI YENİ 👇👇👇
        mapped_data = map_user_inputs(data)
        user_df = pd.DataFrame([mapped_data])
        # 👆👆👆 BURASI YENİ 👆👆👆

        user_df_encoded = pd.get_dummies(user_df)

        # Eksik kolonları tamamla
        for col in EXPECTED_COLUMNS:
            if col not in user_df_encoded.columns:
                user_df_encoded[col] = 0

        # Kolon sırasını sabitle
        user_df_encoded = user_df_encoded[EXPECTED_COLUMNS]

        # Prediction yap
        prediction = model.predict(user_df_encoded)[0]

        return jsonify({'prediction': int(prediction)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def map_user_inputs(data):
    mapped_data = {}
    for question, answer in data.items():
        full_answer = CHOICE_MAP[question][answer].lower().strip()
        feature_name = f"{question}_{full_answer}"
        mapped_data[feature_name] = 1
    return mapped_data

