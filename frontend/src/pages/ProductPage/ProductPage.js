import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import { FaHome } from 'react-icons/fa';
import Navbar from '../../components/Navbar';


export default function ProductPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8); // 2 satır x 4 sütun

  const categoryMap = {};
categories.forEach(cat => {
  categoryMap[cat.category_id] = cat.category_name;
});

    const handleViewMore = () => {
      setVisibleCount(prev => prev + 8); 
    };


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
  
    // Ürünleri çek
    fetch('http://127.0.0.1:5000/products')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched products:", data);  // 👈 log eklendi
        setProducts(data);
      })
      .catch(err => console.error("Product fetch error:", err));
  
    // Kategorileri çek
    fetch('http://127.0.0.1:5000/categories')
    .then(res => res.json())
    .then(data => {
      console.log("Fetched categories:", data);
      setCategories(data); // artık içinde id ve name var
    });
  
  
  }, []);
  
  

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleFilter = () => {
    // Ürünleri filtreleme işlemi burada yapılabilir
    console.log("Filtering for:", selectedCategories);
  };

  // Seçilen kategorilere göre filtrelenmiş ürünleri al
  const filteredProducts = products.filter(product => {
    if (selectedCategories.length === 0) return true;
    const productCategoryName = categoryMap[product.category_id];
    return selectedCategories.includes(productCategoryName);
  });
  
  

  return (
    <>
      <Navbar /> {/* Navbar componenti burada çağrıldı */}

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
            <li key={category.category_id}>
              <label>
                <input
                  type="checkbox"
                  value={category.category_name}
                  checked={selectedCategories.includes(category.category_name)}
                  onChange={handleCategoryChange}
                />
                {category.category_name}
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
    {filteredProducts.slice(0, visibleCount).map(product => (
      <div key={product.product_id} className="product-card">
        <h3>{product.product_name}</h3>
        <p>{categoryMap[product.category_id]}</p>
      </div>
    ))}
  </div>
  
  {visibleCount < filteredProducts.length && (
    <button id="view-more-btn" className="view-more-btn" onClick={handleViewMore}>
      View More
    </button>
  )}
</section>


      <div style={{ height: '1000px' }} />
    </>
  );
}