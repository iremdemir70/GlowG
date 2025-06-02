// src/pages/SuggestPage/SuggestPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './suggest.css';

const categories = ['Cleanser', 'Toner', 'Serum', 'Sunscreen', 'Moisturizer'];

const mockProducts = {
  Cleanser: [
    {
      name: 'Cleanser A',
      ingredients: ['Water', 'Aloe Vera'],
      suitable: true,
      reason: 'Aloe Vera makes this product suitable for your skin type.',
    },
    {
      name: 'Cleanser B',
      ingredients: ['Alcohol', 'Fragrance'],
      suitable: false,
      reason: 'Alcohol makes this product unsuitable for your skin type.',
    },
  ],
  Toner: [
    {
      name: 'Toner A',
      ingredients: ['Rose Water', 'Glycerin'],
      suitable: true,
      reason: 'Glycerin hydrates and is good for your skin type.',
    },
    {
      name: 'Toner B',
      ingredients: ['Alcohol'],
      suitable: false,
      reason: 'Alcohol can irritate your skin type.',
    },
  ],
};

const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    const mainListDiv = document.getElementById('mainListDiv');
    if (mainListDiv) {
      mainListDiv.classList.toggle('show_list');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavActive(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${navActive ? 'affix' : ''}`}>
      <div className="container">
        <div className="logo">
          <a href="#">Glow Genie</a>
        </div>
        <div id="mainListDiv" className="main_list">
          <ul className="navlinks">
            <li><a href="#" className="btn-info">About</a></li>
            <li><a href="#" className="btn-info">Contact</a></li>
            <li>
              <button className="btn" onClick={() => navigate('/home-page')}>
                <span className="icon-home"><i className="fa fa-home"></i></span>
                <span className="text-home">Home</span>
              </button>
            </li>
          </ul>
        </div>
        <span className="navTrigger" onClick={toggleMenu}>
          <i></i><i></i><i></i>
        </span>
      </div>
    </nav>
  );
};

function SuggestPage() {
  const navigate = useNavigate();

  // State for which categories the user has ticked
  const [selectedCategories, setSelectedCategories] = useState([]);

  // State for displaying the product detail modal
  const [modalProduct, setModalProduct] = useState(null);

  // State for user profile & pop-up
  const [userSkinTypeName, setUserSkinTypeName] = useState(null);
  const [showSkinPopup, setShowSkinPopup] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // On mount: check token and fetch profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect immediately
      navigate('/login');
      return;
    }

    // Fetch /profile to get skin_type_name
    axios
      .get('http://127.0.0.1:5000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Expect res.data.skin_type_name to be a string or null/empty if unknown
        const skinName = res.data.skin_type_name || null;
        if (!skinName) {
          // If missing, show pop-up
          setShowSkinPopup(true);
        } else {
          // Otherwise, store it
          setUserSkinTypeName(skinName);
        }
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
        // If token invalid or expired, go to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        } else {
          // Any other error—treat as “unknown”
          setShowSkinPopup(true);
        }
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [navigate]);

  // While we’re waiting for the profile check, render nothing (or a spinner)
  if (loadingProfile) {
    return null;
  }

  // If the user has no skin type saved, show pop-up and do not render UI
  if (showSkinPopup) {
    return (
      <div className="skin-popup-overlay">
        <div className="skin-popup-modal">
          <h2>Önce cilt tipinizi girmeniz gerekir</h2>
          <button
            onClick={() => navigate('/skin-type-test')}
            className="btn btn-primary"
          >
            Cilt Tip Testine Git
          </button>
          <button
            onClick={() => setShowSkinPopup(false)}
            className="btn btn-secondary mx-2"
          >
            Vazgeç
          </button>
        </div>
      </div>
    );
  }

  // Toggle a category pill on/off
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="glow-genie-app">
      <header>
        <Navbar />

        <p>
          Your skin type is…{' '}
          <strong>{userSkinTypeName}</strong>
        </p>
        <p>Product category you would like us to recommend:</p>
        <div className="categories">
          {categories.map((cat) => (
            <label
              key={cat}
              className={selectedCategories.includes(cat) ? 'active' : ''}
            >
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

      <h2 style={{ fontWeight: 'bold', color: '#4b0082' }}>
        Chosen For You:
      </h2>

      <section className="product-columns">
        {selectedCategories.map((cat) => (
          <div key={cat} className="product-column">
            <h2>{cat}</h2>
            {mockProducts[cat]?.map((product, i) => (
              <div
                key={i}
                className={`product-box ${
                  product.suitable ? 'suitable' : 'unsuitable'
                }`}
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

      <div style={{ height: '1000px' }}>
        {/* Spacer to allow scrolling */}
      </div>

      {modalProduct && (
        <div
          className={`product-modal ${
            modalProduct.suitable ? 'suitable' : 'unsuitable'
          }`}
        >
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setModalProduct(null)}
            >
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
