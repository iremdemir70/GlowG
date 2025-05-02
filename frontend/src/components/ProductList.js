import React, { useState } from 'react';

const allProducts = [
  { name: 'Hydrating Cleanser', category: 'cleanser' },
  { name: 'Gentle Toner', category: 'toner' },
  { name: 'Vitamin C Serum', category: 'serum' },
  { name: 'Deep Clean Cleanser', category: 'cleanser' },
  { name: 'Pore Tightening Toner', category: 'toner' },
  { name: 'Anti-Aging Serum', category: 'serum' },
  { name: 'Soothing Cleanser', category: 'cleanser' },
  { name: 'Brightening Toner', category: 'toner' },
  { name: 'Hydra Serum', category: 'serum' }
];

const ProductList = ({ selectedCategory }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = selectedCategory
    ? allProducts.filter(p => p.category === selectedCategory)
    : allProducts;

  return (
    <div>
      <div id="product-list">
        {filtered.slice(0, visibleCount).map((p, i) => (
          <div key={i} className="product-card">{p.name}</div>
        ))}
      </div>
      {visibleCount < filtered.length && (
        <button id="view-more-btn" onClick={() => setVisibleCount(visibleCount + 3)}>View More</button>
      )}
    </div>
  );
};

export default ProductList;