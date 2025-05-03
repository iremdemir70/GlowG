import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import Navbar from '../../components/Navbar';
import '../../components/Navbar.css';


const categories = ["Cleanser", "Moisturizer", "Sunscreen", "Serum", "Toner"];
const products = [
  { id: 1, name: 'Product 1', category: 'Cleanser', price: '$20' },
  { id: 2, name: 'Product 2', category: 'Moisturizer', price: '$30' },
  { id: 3, name: 'Product 3', category: 'Sunscreen', price: '$25' },
  { id: 4, name: 'Product 4', category: 'Serum', price: '$40' },
  { id: 5, name: 'Product 5', category: 'Toner', price: '$15' },
];

export default function ProductPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleFilter = () => {
    console.log("Filtering for:", selectedCategories);
  };

  const filteredProducts = products.filter(product =>
    selectedCategories.length === 0 || selectedCategories.includes(product.category)
  );

  return (
    <>
      <Navbar /> {/* Navbar component*/}

      <main className="main-content">
        <h2 className="section-title">
          Our registered products that we can recommend to you
        </h2>
      </main>

      <div className="filter-section">
        <dl className={`dropdown ${dropdownOpen ? 'open' : ''}`}>
          <dt>
            <a href="#" onClick={toggleDropdown}>
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
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.category}</p>
            </div>
          ))}
        </div>
        <button id="view-more-btn" className="view-more-btn">View More</button>
      </section>

      <div style={{ height: '1000px' }} />
    </>
  );
}
