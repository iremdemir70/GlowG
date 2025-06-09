import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RightForMe.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const RightForMe = () => {
  const navigate = useNavigate(); // 🔧 Eklendi
  const [input, setInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSkinType, setUserSkinType] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Category fetch error:', err));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:5000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const skinTypeName = res.data?.skin_type_name || null;
      setUserSkinType(skinTypeName);

      if (!skinTypeName || skinTypeName === 'Unknown') {
        alert("Lütfen önce cilt tipi testini çözerek cilt tipinizi belirleyin.");
       // navigate('/skin-type-test');
      }
    })
    .catch(err => {
      console.error('Profile fetch error:', err);
      setUserSkinType(null);
      //navigate('/skin-type-test');
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    const productNames = input
      .split(',')
      .map(name => name.trim())
      .filter(name => name !== '');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:5000/predict-multiple', {
        product_names: productNames,
        category_id: parseInt(selectedCategory)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setResults(res.data);
    } catch (err) {
      setResults([{ product_name: 'ERROR', error: err.response?.data?.error || 'Unknown error' }]);
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      <Navbar />


      <div className="page-wrapper mt-5 pt-5 text-center">
        <h3 className="mb-3 text-purple">Is This Product Right For You?</h3>

        {userSkinType && (
          <div className="text-center mt-3">
            <h5>Your skin type is: <span className="badge badge-transparent">{userSkinType}</span></h5>
          </div>
        )}

        <p className="text-muted mb-4">Enter multiple product names separated by commas</p>

        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center gap-3">
          <input
            type="text"
            className="form-control wide-input"
            placeholder="Example: CeraVe Cleanser, La Roche Tonic"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="form-select wide-input"
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
          <button type="submit" className="btn btn-primary btn-lg">Submit</button>
        </form>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-5">
            {results.map((r, i) => (
              <div key={i} className="result-card mx-auto p-4 shadow-sm mb-3 rounded-4 border text-start">
                <h5 className="mb-2"><strong>{r.product_name}</strong></h5>
                {r.error ? (
                  <p className="text-danger">Error: {r.error}</p>
                ) : (
                  <>
                    <p className={`fw-bold mb-2 ${r.suitability.label === 'Suitable' ? 'text-success' : 'text-danger'}`}>
                      {r.suitability.label === 'Suitable' ? '✓ Suitable' : '✗ Not Suitable'}
                    </p>
                    <p><strong>Skin Type:</strong> {r.suitability.skin_type}</p>
                    <p><strong>Ingredients:</strong> {r.ingredients.join(', ')}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 1000 }} />
    </div>
    
  );
};

export default RightForMe;
