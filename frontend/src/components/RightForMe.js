import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RightForMe.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const RightForMe = () => {
  const [input, setInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Category fetch error:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredictionResult(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        product_name: input,
        category_id: parseInt(selectedCategory)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPredictionResult(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setPredictionResult({ error: err.response?.data?.error || 'Unknown error' });
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      <Navbar />

      <div className="text-center mt-5 pt-5">
        <h4>Your skin type is...{' '}
          <span className="badge badge-transparent">
            {predictionResult?.suitability?.skin_type || '[Skin Type]'}
          </span>
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="my-4 row justify-content-center">
        <div className="col-md-8 d-flex gap-3">
          <input
            type="text"
            className="form-control flex-grow-1"
            placeholder="Enter product name..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-lg px-4">Submit</button>
        </div>
      </form>

      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {predictionResult && (
        <div className="text-center mt-4">
          {predictionResult.error ? (
            <div className="alert alert-danger">{predictionResult.error}</div>
          ) : (
            <>
              <h5 className={`text-${predictionResult.suitability.label === 'Suitable' ? 'success' : 'danger'}`}>
                {predictionResult.suitability.label === 'Suitable' ? '✓ Suitable' : '✗ Not Suitable'}
              </h5>
              <p><strong>Skin Type:</strong> {predictionResult.suitability.skin_type}</p>
              <p><strong>Probability:</strong> {(predictionResult.suitability.probability * 100).toFixed(1)}%</p>
              <p><strong>Ingredients:</strong> {predictionResult.ingredients.join(', ')}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RightForMe;
