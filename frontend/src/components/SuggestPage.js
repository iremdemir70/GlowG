// GlowGenieApp.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './suggest.css';
//import Navbar from '../components/Navbar/Navbar';
const categories = ['Cleanser', 'Toner', 'Serum', 'Sunscreen', 'Moisturizer'];

const mockProducts = {
  Cleanser: [
    { name: 'Cleanser A', ingredients: ['Water', 'Aloe Vera'], suitable: true, reason: 'Aloe Vera makes this product suitable for your skin type.' },
    { name: 'Cleanser B', ingredients: ['Alcohol', 'Fragrance'], suitable: false, reason: 'Alcohol makes this product unsuitable for your skin type.' },
  ],
  Toner: [
    { name: 'Toner A', ingredients: ['Rose Water', 'Glycerin'], suitable: true, reason: 'Glycerin hydrates and is good for your skin type.' },
    { name: 'Toner B', ingredients: ['Alcohol'], suitable: false, reason: 'Alcohol can irritate your skin type.' },
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
  }, []); // 👈 Scroll event listener'ı eklendi

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="glow-genie-app">
      <header>
         <Navbar />
        <p>Your skin type is... <strong>[Skin Type]</strong></p>
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
         <br></br>
        <h2 style={{ fontWeight: 'bold', color: '#4b0082' }}>Chosen For You:</h2> 



      <section className="product-columns">
        {selectedCategories.map((cat) => (
  <div key={cat} className="product-column">
    <h2>{cat}</h2>
    {mockProducts[cat]?.map((product, i) => (
      <div
        key={i}
        className={`product-box ${product.suitable ? 'suitable' : 'unsuitable'}`}
        onClick={() => setModalProduct(product)}
      >
        <p><strong>{product.name}</strong></p>
        <p>{product.ingredients.join(', ')}</p>
      </div>
    ))}
    <button className="view-more">View More...</button>
   
  </div>
))}

      </section>
        <div style={{ height: '1000px' }}>
        {/* Scroll efektini göstermek için boş alan */}
      </div>
      {modalProduct && (
        <div className={`product-modal ${modalProduct.suitable ? 'suitable' : 'unsuitable'}`}>
          <div className="modal-content">
            <button className="close-btn" onClick={() => setModalProduct(null)}>✕</button>
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