import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './ProductPage.css';
import { Link } from 'react-router-dom';
const dummyProducts = [
  { name: 'Hydrating Cleanser', category: 'Cleanser' },
  { name: 'Gentle Toner', category: 'Toner' },
  { name: 'Vitamin C Serum', category: 'Serum' },
  { name: 'Deep Clean Cleanser', category: 'Cleanser' },
  { name: 'Pore Tightening Toner', category: 'Toner' },
  { name: 'Anti-Aging Serum', category: 'Serum' }, 
];

const ProductPage = () => {
  const [navActive, setNavActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  useEffect(() => {
    const handleScroll = () => {
      setNavActive(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    const mainListDiv = document.getElementById('mainListDiv');
    if (mainListDiv) {
      mainListDiv.classList.toggle('show_list');
    }
  };
 const resetFilter = () => {
  setSelectedCategories([]);
  setTempSelectedCategories([]);
};
  const handleCategoryChange = (e) => {
  const { value, checked } = e.target;
  if (checked) {
    setTempSelectedCategories((prev) => [...prev, value]);
  } else {
    setTempSelectedCategories((prev) => prev.filter((item) => item !== value));
  }
};
  const applyFilter = () => {
  setSelectedCategories(tempSelectedCategories);
};
  const Navbar = () => (
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
  <Link to="/home-page" className="btn home-icon-link">
    <span className="home-icon"><i className="fa fa-home"></i></span>
    <span className="home-text">Home</span>
  </Link>
</li>
          </ul>
        </div>
        <span className="navTrigger" onClick={toggleMenu}>
          <i></i><i></i><i></i>
        </span>
      </div>
    </nav>
  );

  const FilterDropdown = ({ isDropdownOpen, setIsDropdownOpen }) => (
    <div className="filter-section">
     <div className="dropdown-and-buttons"></div>
      <dl className="dropdown">
        <dt>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
          }}>
            <span className="hida">
              {tempSelectedCategories.length > 0
                ? tempSelectedCategories.join(', ')
                : 'Select Product Category'}
            </span>
            <p className="multiSel"></p>
          </a>
        </dt>
        {isDropdownOpen && (
          <dd>
            <div className="mutliSelect">
              <ul>
                {['Cleanser', 'Moisturizer', 'Sunscreen', 'Serum', 'Toner'].map((category) => (
                  <li key={category}>
                    <label>
                      <input
  type="checkbox"
  value={category}
  checked={tempSelectedCategories.includes(category)}
  onChange={handleCategoryChange}
/>{' '}
                      {category}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </dd>
        )}
        <button onClick={applyFilter}>Filter</button>
        <button onClick={resetFilter} className="reset-btn">Reset Filter</button>

      </dl>
    </div>
  );

  const ProductList = ({ selectedCategories }) => {
    const filteredProducts =
      selectedCategories.length === 0
        ? dummyProducts
        : dummyProducts.filter((product) =>
            selectedCategories.includes(product.category)
          );

    return (
      <section className="products-section">
        <div id="product-list" className="products-container">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <button key={index} className="product-item">
                {product.name}
              </button>
            ))
          ) : (
            <p className="no-products">No products match your selection.</p>
          )}
        </div>
      </section>
    );
  };

  const ViewMoreButton = () => (
    <button id="view-more-btn" className="view-more-btn">
      View More
    </button>
  );

  return (
    <div>
      <Navbar />
      <main className="main-content">
        <h2 className="section-title">
          Our registered products that we can recommend to you
        </h2>
      </main>
      <FilterDropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      <ProductList selectedCategories={selectedCategories} />
      <ViewMoreButton />

      <div style={{ height: '1000px' }}>
        {/* Scroll efektini göstermek için boş alan */}
      </div>
    </div>
  );
};

export default ProductPage;
