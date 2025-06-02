// frontend/src/pages/SuggestPage/SuggestPage.js

import React, { useState, useEffect } from 'react';
import './SuggestPage.css';    // your CSS file for styling (copy/adapt from ProductPage.css + RightForMe.css)
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ----------------------
// Navbar Component
// (You can reuse the same Navbar you used elsewhere, or copy/paste from RightForMe.js)
// ----------------------
const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    const mainListDiv = document.getElementById('mainListDiv');
    if (mainListDiv) {
      mainListDiv.classList.toggle('show_list');
    }
    setMenuOpen((prev) => !prev);
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
            <li>
              <a href="#" className="btn-info">About</a>
            </li>
            <li>
              <a href="#" className="btn-info">Contact</a>
            </li>
            <li>
              <button className="btn" onClick={() => navigate('/home-page')}>
                {menuOpen ? 'Home' : <i className="fa fa-home"></i>}
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

// ----------------------
// ProductModal Component
// ----------------------
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="modal d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-content ${product.suitable ? 'border-success' : 'border-danger'}`}>
          <div className="modal-header">
            <h5 className="modal-title">{product.product_name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Ingredients:</strong> {product.ingredients.join(', ')}</p>
            <p className="text-muted">{product.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------
// Main SuggestPage Component
// ----------------------
const SuggestPage = () => {
  const navigate = useNavigate();

  // State
  const [token, setToken] = useState(null);
  const [userSkinTypeName, setUserSkinTypeName] = useState(null);
  const [showSkinPopup, setShowSkinPopup] = useState(false);

  const [allCategories, setAllCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [allProducts, setAllProducts] = useState([]);        // List of {product_name, category_name, ingredients, suitable, reason, product_id}
  const [visibleCount, setVisibleCount] = useState(8);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // ----------------------
  // 1) On mount: check token & fetch profile
  // ----------------------
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      navigate('/login');
      return;
    }
    setToken(savedToken);

    // Fetch user profile to get skin_type_name
    axios
      .get('http://127.0.0.1:5000/profile', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      .then((res) => {
        // Example response: { user_id: 3, email:"…", skin_type_id:2, skin_type_name:"Dry", … }
        const profile = res.data;
        const skinName = profile.skin_type_name || null;
        if (!skinName) {
          setShowSkinPopup(true);
        } else {
          setUserSkinTypeName(skinName);
        }
      })
      .catch((err) => {
        console.error('Profile fetch error:', err);
        // If 401/403, redirect to login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        } else {
          setShowSkinPopup(true);
        }
      });
  }, [navigate]);

  // ----------------------
  // 2) On mount: fetch categories and suggested products
  // ----------------------
  useEffect(() => {
    if (!token) return;

    // a) fetch all categories so user can filter
    axios
      .get('http://127.0.0.1:5000/categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Expect res.data = [ { category_id: 1, category_name: 'Cleanser' }, … ]
        setAllCategories(res.data);
      })
      .catch((err) => {
        console.error('Category fetch error:', err);
      });

    // b) fetch all suggested products for this user
    axios
      .get('http://127.0.0.1:5000/suggest-products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Expect res.data = { products: [ { product_id, product_name, category_name, ingredients:[], suitable:boolean, reason:string }, … ] }
        setAllProducts(res.data.products || []);
      })
      .catch((err) => {
        console.error('Suggest-products fetch error:', err);
      });
  }, [token]);

  // ----------------------
  // 3) Popup if no skin type
  // ----------------------
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

  // ----------------------
  // 4) Category filter logic (same pattern as ProductPage)
  // ----------------------
  const handleCategoryToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleTempCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTempSelectedCategories((prev) => [...prev, value]);
    } else {
      setTempSelectedCategories((prev) => prev.filter((c) => c !== value));
    }
  };

  const applyFilter = () => {
    setSelectedCategories(tempSelectedCategories);
    setVisibleCount(8);
    setIsDropdownOpen(false);
  };

  const resetFilter = () => {
    setSelectedCategories([]);
    setTempSelectedCategories([]);
    setVisibleCount(8);
    setIsDropdownOpen(false);
  };

  // Helper: Return product list filtered by selectedCategories
  const filteredProducts =
    selectedCategories.length === 0
      ? allProducts
      : allProducts.filter((p) => selectedCategories.includes(p.category_name));

  // Show only the first `visibleCount` items
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div>
      <Navbar />

      <main className="main-content">
        <h2 className="section-title">
          Products Suggested for Your Skin ({userSkinTypeName})
        </h2>
      </main>

      {/* ----------------------
          5) Category Filter (Dropdown + Checkboxes)
      ---------------------- */}
      <div className="filter-section">
        <dl className="dropdown">
          <dt>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryToggle();
              }}
            >
              <span className="hida">
                {tempSelectedCategories.length > 0
                  ? tempSelectedCategories.join(', ')
                  : 'Select Product Category'}
              </span>
            </a>
          </dt>

          {isDropdownOpen && (
            <dd>
              <div className="mutliSelect">
                <ul>
                  {allCategories.map((cat) => (
                    <li key={cat.category_id}>
                      <label>
                        <input
                          type="checkbox"
                          value={cat.category_name}
                          checked={tempSelectedCategories.includes(cat.category_name)}
                          onChange={handleTempCategoryChange}
                        />{' '}
                        {cat.category_name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </dd>
          )}

          <button onClick={applyFilter} className="btn apply-btn">
            Apply Filter
          </button>
          <button onClick={resetFilter} className="btn reset-btn mx-2">
            Reset Filter
          </button>
        </dl>
      </div>

      {/* ----------------------
          6) Products Grid (Green/Red Framing + Click→Modal)
      ---------------------- */}
      <section className="products-section">
        <div className="products-container">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product, index) => (
              <button
                key={product.product_id || index}
                className={`product-item ${product.suitable ? 'suitable' : 'unsuitable'}`}
                onClick={() => setSelectedProduct(product)}
              >
                {product.product_name}
              </button>
            ))
          ) : (
            <p className="no-products">No products match your selection.</p>
          )}
        </div>
      </section>

      {/* ----------------------
          7) View More Button
      ---------------------- */}
      {visibleCount < filteredProducts.length && (
        <button
          className="view-more-btn"
          onClick={() => setVisibleCount((prev) => prev + 8)}
        >
          View More
        </button>
      )}

      {/* ----------------------
          8) Modal for Single Product (Name / Ingredients / Reason)
      ---------------------- */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div style={{ height: '500px' }}></div> {/* spacer for scrolling */}
    </div>
  );
};

export default SuggestPage;
