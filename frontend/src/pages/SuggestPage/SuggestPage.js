import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './suggest.css';

const categories = ['Cleanser', 'Toner', 'Serum', 'Sunscreen', 'Moisturizer'];

function SuggestPage() {
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [userSkinTypeName, setUserSkinTypeName] = useState(null);
  const [showSkinPopup, setShowSkinPopup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [suggestedProducts, setSuggestedProducts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://127.0.0.1:5000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const skinName = res.data.skin_type_name || null;
        if (!skinName) {
          setShowSkinPopup(true);
        } else {
          setUserSkinTypeName(skinName);
        }
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        } else {
          setShowSkinPopup(true);
        }
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (selectedCategories.length === 0 || !userSkinTypeName) return;

    const token = localStorage.getItem('token');
    axios
      .post(
        'http://127.0.0.1:5000/suggest-products',
        {
          categories: selectedCategories,
          skin_type_name: userSkinTypeName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setSuggestedProducts(res.data);
      })
      .catch((err) => {
        console.error('Suggestion fetch error:', err);
      });
  }, [selectedCategories, userSkinTypeName]);

  if (loadingProfile) return null;

  if (showSkinPopup) {
    return (
      <div className="skin-popup-overlay">
        <div className="skin-popup-modal">
          <h2>Önce cilt tipinizi girmeniz gerekir</h2>
          <button onClick={() => navigate('/skin-type-test')} className="btn btn-primary">
            Cilt Tip Testine Git
          </button>
          <button onClick={() => setShowSkinPopup(false)} className="btn btn-secondary mx-2">
            Vazgeç
          </button>
        </div>
      </div>
    );
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="glow-genie-app">
      <header>
        <p>
          Your skin type is… <strong>{userSkinTypeName}</strong>
        </p>
        <p>Product category you would like us to recommend:</p>
        <div className="categories">
          {categories.map((cat) => (
            <label key={cat} className={selectedCategories.includes(cat) ? 'active' : ''}>
              <input
                type="checkbox"
                value={cat}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </header>

      <br />

      <h2 style={{ fontWeight: 'bold', color: '#4b0082' }}>Chosen For You:</h2>

      <section className="product-columns">
        {selectedCategories.map((cat) => (
          <div key={cat} className="product-column">
            <h2>{cat}</h2>
            {suggestedProducts[cat]?.map((product, i) => (
              <div
                key={i}
                className={`product-box ${product.suitable ? 'suitable' : 'unsuitable'}`}
                onClick={() => setModalProduct(product)}
              >
                <p>
                  <strong>{product.name}</strong>
                </p>
                <p>{product.ingredients.join(', ')}</p>
              </div>
            ))}
            <button className="view-more">View More...</button>
          </div>
        ))}
      </section>

      <div style={{ height: '1000px' }}></div>

      {modalProduct && (
        <div className={`product-modal ${modalProduct.suitable ? 'suitable' : 'unsuitable'}`}>
          <div className="modal-content">
            <button className="close-btn" onClick={() => setModalProduct(null)}>
              ✕
            </button>
            <h2>{modalProduct.name}</h2>
            <p>{modalProduct.ingredients.join(', ')}</p>
            <p>{modalProduct.reason}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestPage;
