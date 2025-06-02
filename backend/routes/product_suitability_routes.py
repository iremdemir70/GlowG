from flask import Blueprint, request, jsonify
from flasgger import swag_from
import pandas as pd

from database.db import db
from models.product import Product        # <-- SQLAlchemy modelınızın adı ve konumu
from ml.mlpredictor import build_feature_vector, predict_suitability, ML_MODELS

skin_bp = Blueprint('skin_bp', __name__)


@skin_bp.route('/predict-product-suitability', methods=['POST'])
@swag_from({
    'tags': ['Product Suitability'],
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'product_id': {'type': 'integer'}
                },
                'required': ['product_id']
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Ürünün her cilt tipine göre uygunluğu, olasılığı ve SHAP açıklamaları',
            'examples': {
                'application/json': {
                    'KURU':       {'prediction': True,  'prob': 0.823, 'shap_explanation': '…'},
                    'YAGLI':      {'prediction': False, 'prob': 0.124, 'shap_explanation': '…'},
                    'KARMA':      {'prediction': True,  'prob': 0.562, 'shap_explanation': '…'},
                    'NORMAL':     {'prediction': False, 'prob': 0.301, 'shap_explanation': '…'}
                }
            }
        },
        400: {'description': 'product_id gerekli'},
        404: {'description': 'Ürün bulunamadı'},
        500: {'description': 'Sunucu hatası'}
    }
})
def predict_product_suitability():
    try:
        data = request.get_json()
        if not data or 'product_id' not in data:
            return jsonify({'error': 'product_id gerekli'}), 400

        product_id = data['product_id']
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Ürün bulunamadı'}), 404

        # --------------------------------------------------------------------
        # 1) Önce, X = build_feature_vector(...) ile ürünün feature vektörünü oluştur:
        #    - ML_MODELS içindeki herhangi bir skin_type'ın 'model' objesinden
        #      model.feature_names_in_ alarak sütun isimlerini alınabilir.
        #    - Varsayalım ki bütün skin_type modellerinde aynı feature set var.
        # --------------------------------------------------------------------
        any_skin_model, _ = next(iter(ML_MODELS.values()))
        expected_cols    = any_skin_model.feature_names_in_
        X = build_feature_vector(product_id, expected_cols)
        # Eğer build_feature_vector eksik sütun bırakıyorsa, burada:
        for col in expected_cols:
            if col not in X.columns:
                X[col] = 0
        X = X[expected_cols]  # sütun sırasını da sabitlemiş olalım

        # ----------------------------------------------------------------------------
        # 2) Dört farklı cilt tipi üzerindeki döngü:
        #    - ML_MODELS dict’inde: {"YAGLI": (model, explainer), "KURU": (...), ...}
        #    - Her biri için predict_suitability(...) çağrısı → (prob, label)
        #    - Aynı X'i, explainer.shap_values(X) ile SHAP değerine çevir
        # ----------------------------------------------------------------------------
        # “products” tablonuza eklediğiniz, PostgreSQL sütun isimleri ile birebir uyumlu
        COL_FLAG = {
            'KURU':   'is_dry',
            'YAGLI':  'is_oily',
            'KARMA':  'is_combination',
            'NORMAL': 'is_normal',
        }
        COL_SHAP = {
            'KURU':   'shap_dry',
            'YAGLI':  'shap_oily',
            'KARMA':  'shap_combination',
            'NORMAL': 'shap_normal',
        }

        results = {}
        for skin_key, (model, explainer) in ML_MODELS.items():
            # ------------------------------------------------------
            # a) Olasılık + label (Suitable/Not Suitable) almak:
            # ------------------------------------------------------
            try:
                prob, label = predict_suitability(product_id, skin_key)
                # predict_suitability otomatik olarak X’i de oluşturdu, fakat
                # biz burada X’i yukarıda tek sefer inşa edip sütun sırasını sabitledik.
                # predict_suitability içinde kendi build_feature_vector var, 
                # ama biz X’i elden oluşturduğumuz için ihtiyaca göre yeniden tahmin
                # yapmak istersek:
                #    proba = model.predict_proba(X)[0,1]
                #    label = "Suitable" if proba >= 0.5 else "Not Suitable"
                # şeklinde de yazılabilir. Ancak biz fonksiyonu kullanalım.
            except Exception as e:
                return jsonify({'error': f"'{skin_key}' için uygunluk tahmini sırasında hata: {e}"}), 500

            # ------------------------------------------------------
            # b) SHAP değerlerini alıp, tek bir string haline dönüştürelim:
            # ------------------------------------------------------
            try:
                # Eski SHAP API kullanıldıysa:
                shap_vals = explainer.shap_values(X)  # örn: [array((1,n_feat)), …] veya array((1,n_feat))
                if isinstance(shap_vals, (list, tuple)):
                    raw_shap = shap_vals[0][0] if isinstance(shap_vals[0], (list, tuple)) else shap_vals[0]
                else:
                    # Yeni SHAP API: explainer(X) döner; shap_vals.values (1, n_feat) içerir
                    raw_shap = shap_vals.values[0]
            except Exception as e:
                raw_shap = None

            # SHAP → okunabilir metne çevirme:
            if raw_shap is not None:
                feature_names = X.columns.tolist()
                pairs = []
                for idx, fname in enumerate(feature_names):
                    val = raw_shap[idx]
                    pairs.append(f"{fname} ({val:.4f})")
                shap_text = ", ".join(pairs)
            else:
                shap_text = "SHAP açıklaması üretilemedi."

            # ------------------------------------------------------
            # c) SQLAlchemy Product nesnesine atama:
            # ------------------------------------------------------
            setattr(product, COL_FLAG[skin_key], True if label == "Suitable" else False)
            setattr(product, COL_SHAP[skin_key], shap_text)

            # ------------------------------------------------------
            # d) Response JSON’unda da saklayalım:
            # ------------------------------------------------------
            results[skin_key] = {
                'prediction': label == "Suitable",
                'prob': round(prob, 3),
                'shap_explanation': shap_text
            }

        # ------------------------------------------------------
        # 3) DB’ye yaz, tüm skin_type sonuçlarını tek commit’te kaydet:
        # ------------------------------------------------------
        db.session.commit()

        return jsonify(results), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

