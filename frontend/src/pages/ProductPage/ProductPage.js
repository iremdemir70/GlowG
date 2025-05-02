import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import { FaHome } from 'react-icons/fa';

const categories = ["Cleanser", "Moisturizer", "Sunscreen", "Serum", "Toner"];

export default function ProductPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleFilter = () => {
    // Ürünleri filtreleme işlemi burada yapılabilir
    console.log("Filtering for:", selectedCategories);
  };

  return (
    <>
      <nav className={`nav ${isScrolled ? 'affix' : ''}`}>
        <div className="container">
          <div className="logo">
            <a href="#">Glow Genie</a>
          </div>
          <div id="mainListDiv" className={`main_list ${menuOpen ? 'show_list' : ''}`}>
            <ul className="navlinks">
              <li><a href="#" className="btn-info">About</a></li>
              <li><a href="#" className="btn-info">Contact</a></li>
              <li>
                <button className="btn" onClick={() => window.location.href = 'index.html'}>
                  <FaHome />
                </button>
              </li>
            </ul>
          </div>

          <span className="navTrigger" onClick={toggleMenu}>
            <i></i>
            <i></i>
            <i></i>
          </span>
        </div>
      </nav>

      <main className="main-content">
        <h2 className="section-title">
          Our registered products that we can recommend to you
        </h2>
      </main>

      <div className="filter-section">
        <dl className="dropdown">
          <dt>
            <a href="#">
              <span className="hida">Select Product Category</span>
              <p className="multiSel">{selectedCategories.join(', ')}</p>
            </a>
          </dt>
          <dd>
            <div className="mutliSelect">
              <ul>
                {categories.map(category => (
                  <li key={category}>
                    <label>
                      <input
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={handleCategoryChange}
                      />
                      {category}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </dd>
          <button onClick={handleFilter}>Filter</button>
        </dl>
      </div>

      <section className="products-section">
        <div id="product-list" className="products-container">
          {/* Ürün kartları burada listelenebilir */}
        </div>
        <button id="view-more-btn" className="view-more-btn">View More</button>
      </section>

      <div style={{ height: '1000px' }} />
    </>
  );
}