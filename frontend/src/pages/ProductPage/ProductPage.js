import React, { useState, useEffect } from 'react';
import './ProductPage.css';

const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // 2 satır (4x2)

  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then(res => res.json())
      .then(data => setAllProducts(data));

    fetch("http://127.0.0.1:5000/categories")
      .then(res => res.json())
      .then(data => setAllCategories(data));
  }, []);

  const resetFilter = () => {
    setSelectedCategories([]);
    setTempSelectedCategories([]);
    setVisibleCount(8); // resetle
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTempSelectedCategories(prev => [...prev, value]);
    } else {
      setTempSelectedCategories(prev => prev.filter(item => item !== value));
    }
  };

  const applyFilter = () => {
    setSelectedCategories(tempSelectedCategories);
    setVisibleCount(8); // filtre değişince başa dön
  };

  const getCategoryNameById = (id) => {
    const cat = allCategories.find(c => c.category_id === id);
    return cat ? cat.category_name : '';
  };

  const filteredProducts = selectedCategories.length === 0
    ? allProducts
    : allProducts.filter(product =>
        selectedCategories.includes(getCategoryNameById(product.category_id))
      );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div>
      <main className="main-content">
        <h2 className="section-title">
          Our registered products that we can recommend to you
        </h2>
      </main>

      {/* ✅ Dropdown Filter */}
      <div className="filter-section">
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
            </a>
          </dt>
          {isDropdownOpen && (
            <dd>
              <div className="mutliSelect">
                <ul>
                  {allCategories.map(category => (
                    <li key={category.category_id}>
                      <label>
                        <input
                          type="checkbox"
                          value={category.category_name}
                          checked={tempSelectedCategories.includes(category.category_name)}
                          onChange={handleCategoryChange}
                        />{' '}
                        {category.category_name}
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

      {/* ✅ Ürün Listesi */}
      <section className="products-section">
        <div className="products-container">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product, index) => (
              <button key={index} className="product-item">
                {product.product_name}
              </button>
            ))
          ) : (
            <p className="no-products">No products match your selection.</p>
          )}
        </div>
      </section>

      {/* ✅ View More */}
      {visibleCount < filteredProducts.length && (
        <button
          className="view-more-btn"
          onClick={() => setVisibleCount(prev => prev + 8)} // 8 ürün daha (2 satır)
        >
          View More
        </button>
      )}
    </div>
  );
};

export default ProductPage;
