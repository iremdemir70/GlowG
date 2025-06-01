import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RightForMe.css';
import { useNavigate } from 'react-router-dom';

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
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand navbar-custom fixed-top px-4">
      <span className="navbar-brand fw-bold text-purple">Glow Genie</span>
      <div className="d-flex gap-4 align-items-center ms-auto">
        <a href="#" className="nav-link text-dark">About</a>
        <a href="#" className="nav-link text-dark">Contact</a>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/home-page')}>
          <i className="fa fa-home"></i>
        </button>
      </div>
    </nav>
  );
};


// ✅ Modal
const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="modal d-block" onClick={onClose}>
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

// ✅ Ana Component
const RightForMe = () => {
  const [input, setInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suitable, setSuitable] = useState([]);
  const [unsuitable, setUnsuitable] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const names = input.split(',').map(name => name.trim().toLowerCase()).filter(Boolean);

    const matchedSuitable = dummyProducts.filter(p => p.suitable && names.includes(p.name.toLowerCase()));
    const matchedUnsuitable = dummyProducts.filter(p => !p.suitable && names.includes(p.name.toLowerCase()));

    setSuitable(matchedSuitable);
    setUnsuitable(matchedUnsuitable);
    setIsSearched(true);
  };

  return (
    <div className="container py-5">
      <Navbar />

      <div className="text-center mt-5 pt-5">
        <h4>Your skin type is... <span className="badge badge-transparent">[Skin Type]</span></h4>
      </div>

<form onSubmit={handleSubmit} className="my-4 row justify-content-center">
  <div className="col-lg-8 d-flex flex-wrap justify-content-center gap-3">
    <input
      type="text"
      className="form-control flex-grow-1 rounded-pill px-4 py-2"
      style={{ minWidth: '300px', maxWidth: '600px' }}
      placeholder="Product1, Product2..."
      value={input}
      onChange={e => setInput(e.target.value)}
    />
    <button
      type="submit"
      className="btn btn-lg px-4 text-white"
      style={{
        backgroundColor: '#6a1b9a',
        borderRadius: '999px',
        fontWeight: '500',
      }}
    >
      Submit
    </button>
  </div>
  <div className="text-center mt-2">
    <small className="text-muted">Enter products like Product1, Product2…</small>
  </div>
</form>


      {isSearched && (
        <div className="row mt-4">
          <div className="col-md-6">
            <h5 className="text-success text-center">✓ Suitable Products</h5>
            {suitable.length > 0 ? suitable.map((p, i) => (
              <div key={i} className="card mb-2 border-success" onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <strong>{p.name}</strong>
                  <p className="mb-0">{p.ingredients.join(', ')}</p>
                </div>
              </div>
            )) : <p>No suitable products found.</p>}
          </div>
          <div className="col-md-6">
            <h5 className="text-danger text-center">✗ Unsuitable Products</h5>
            {unsuitable.length > 0 ? unsuitable.map((p, i) => (
              <div key={i} className="card mb-2 border-danger" onClick={() => setSelectedProduct(p)} style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <strong>{p.name}</strong>
                  <p className="mb-0">{p.ingredients.join(', ')}</p>
                </div>
              </div>
            )) : <p>No unsuitable products found.</p>}
          </div>
        </div>
      )}

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
};

export default RightForMe;
