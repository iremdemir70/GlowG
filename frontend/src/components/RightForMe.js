import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RightForMe.css';
import { useNavigate } from 'react-router-dom';
// Dummy ürün verisi
const dummyProducts = [
  {
    name: 'Product 1',
    ingredients: ['Ingredient1', 'Ingredient2', 'Ingredient3'],
    suitable: true,
    reason: 'Ingredient3 makes this product suitable for your skin type.',
  },
  {
    name: 'Product 2',
    ingredients: ['Ingredient4', 'Ingredient5'],
    suitable: false,
    reason: 'Ingredient4 makes this product unsuitable for your skin type.',
  },
  {
    name: 'Product 3',
    ingredients: ['Ingredient4', 'Ingredient5'],
    suitable: false,
    reason: 'Ingredient4 makes this product unsuitable for your skin type.',
  },
];

// ✅ Navbar bileşeni
const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 Menü açık mı?
  const navigate = useNavigate();

  const toggleMenu = () => {
    const mainListDiv = document.getElementById('mainListDiv');
    if (mainListDiv) {
      mainListDiv.classList.toggle('show_list');
    }
    setMenuOpen(prev => !prev); // 👈 Menü durumunu değiştir
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


// ✅ Modal bileşeni
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
        <div className={`modal-content ${product.suitable ? 'border-success' : 'border-danger'}`}>
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
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

// ✅ Ana bileşen
const RightForMe = () => {
  const [input, setInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredSuitable, setFilteredSuitable] = useState([]);
  const [filteredUnsuitable, setFilteredUnsuitable] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const searchedProducts = input
      .split(',')
      .map(name => name.trim().toLowerCase())
      .filter(name => name);

    const suitableFiltered = dummyProducts.filter(
      p => p.suitable && searchedProducts.includes(p.name.toLowerCase())
    );

    const unsuitableFiltered = dummyProducts.filter(
      p => !p.suitable && searchedProducts.includes(p.name.toLowerCase())
    );

    setFilteredSuitable(suitableFiltered);
    setFilteredUnsuitable(unsuitableFiltered);
    setIsSearched(true);
  };

  const suitableProducts = isSearched ? filteredSuitable : [];
  const unsuitableProducts = isSearched ? filteredUnsuitable : [];

  return (
    <div className="container py-5">
      <Navbar />

      <h4 className="text-center mb-5" style={{ marginTop: '100px' }}>
        Your skin type is... <span className="badge badge-transparent">[Skin Type]</span>
      </h4>


      <form onSubmit={handleSubmit} className="row g-3 justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Product1, Product2..."
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
        <div className="text-center">
          <small className="text-muted">
            Please enter the products in the desired form. Such as Product1, Product2, etc…
          </small>
        </div>
      </form>

      {isSearched && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <h5 className="text-success">Suitable Products</h5>
            {suitableProducts.length > 0 ? suitableProducts.map((product, index) => (
              <div
                key={index}
                className="card mb-2 border-success"
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <strong>{product.name}</strong>
                  <p className="mb-0">{product.ingredients.join(', ')}</p>
                </div>
              </div>
            )) : <p>No suitable products found.</p>}
          </div>

          <div className="col-md-6 mb-4">
            <h5 className="text-danger">Unsuitable Products</h5>
            {unsuitableProducts.length > 0 ? unsuitableProducts.map((product, index) => (
              <div
                key={index}
                className="card mb-2 border-danger"
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <strong>{product.name}</strong>
                  <p className="mb-0">{product.ingredients.join(', ')}</p>
                </div>
              </div>
            )) : <p>No unsuitable products found.</p>}
          </div>
        </div>
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div style={{ height: '1000px' }}></div>
    </div>
  );
};

export default RightForMe;
