import React, { useState, useEffect } from "react";
import "./ProductPage.css";
import { Link } from "react-router-dom";

/* === Sabitler & Yardımcılar =============================== */

// ✔ Backend’de kayıtlı skin-type ID ⇄ isim eşleşmesi.
//  Gerçekte /skin-types endpoint’inden fetch edebilirsiniz.
const SKIN_TYPE_MAP = {
  1: "Oily",
  2: "Dry",
  3: "Combination",
  4: "Sensitive",
  5: "Normal",
};
const nameToId = (name) =>
  Object.keys(SKIN_TYPE_MAP).find((k) => SKIN_TYPE_MAP[k] === name);
const idToName = (id) => SKIN_TYPE_MAP[id] || id;

/* === Bileşen ============================================= */

const ProductPage = () => {
  /* ---------- State ---------- */
  const [navActive, setNavActive] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [tempSelectedCategories, setTempSelectedCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // NEW – admin & token bilgisi (localStorage’ta sakladığımızı varsayıyoruz)
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const token = localStorage.getItem("token");

  // Modal suitable_for (string listesi)
  const [modalSuitableFor, setModalSuitableFor] = useState([]);

  /* ---------- Navbar ---------- */
  const Navbar = () => (
    <nav className={`nav ${navActive ? "affix" : ""}`}>
      <div className="container">
        <div className="logo">
          <a href="#">Glow Genie</a>
        </div>
        <div id="mainListDiv" className="main_list">
          <ul className="navlinks">
            <li>
              <a href="#" className="btn-info">
                About
              </a>
            </li>
            <li>
              <a href="#" className="btn-info">
                Contact
              </a>
            </li>
            <li>
              <Link to="/home-page" className="btn home-icon-link">
                <span className="home-icon">
                  <i className="fa fa-home"></i>
                </span>
                <span className="home-text">Home</span>
              </Link>
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
  );

  /* ---------- Scroll efekti ---------- */
  useEffect(() => {
    const handleScroll = () => setNavActive(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    const mainListDiv = document.getElementById("mainListDiv");
    if (mainListDiv) mainListDiv.classList.toggle("show_list");
  };

  /* ---------- Ürün & Kategori verilerini çek ---------- */
  useEffect(() => {
    // GET /products (herkese açık)
    fetch("http://127.0.0.1:5000/products")
      .then((res) => res.json())
      .then((data) =>
        // suitable_for (id[]) → string[]
        setAllProducts(
          data.map((p) => ({
            ...p,
            suitable_for: (p.suitable_for || []).map(idToName),
          }))
        )
      );

    // GET /categories
    fetch("http://127.0.0.1:5000/categories")
      .then((res) => res.json())
      .then((data) => setAllCategories(data));
  }, []);

  /* ---------- Filtreleme ---------- */
  const resetFilter = () => {
    setSelectedCategories([]);
    setTempSelectedCategories([]);
    setVisibleCount(8);
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setTempSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const applyFilter = () => {
    setSelectedCategories(tempSelectedCategories);
    setVisibleCount(8);
  };

  const getCategoryNameById = (id) =>
    allCategories.find((c) => c.category_id === id)?.category_name || "";

  const filteredProducts =
    selectedCategories.length === 0
      ? allProducts
      : allProducts.filter((p) =>
          selectedCategories.includes(getCategoryNameById(p.category_id))
        );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* ---------- Modal suitable_for checkbox ---------- */
  const handleSuitableForChange = (e) => {
    const { value, checked } = e.target;
    setModalSuitableFor((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  // Modal açıldığında uygun skin-type’ları yükle
  useEffect(() => {
    if (selectedProduct)
      setModalSuitableFor(selectedProduct.suitable_for || []);
  }, [selectedProduct]);

  /* ---------- Kaydet: PUT /products/{id} ---------- */
  const saveSuitableFor = async () => {
    if (!token) {
      alert("Oturum bilgisi bulunamadı!");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/products/${selectedProduct.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // NEW ⭐️
          },
          body: JSON.stringify({
            suitable_for: modalSuitableFor.map(nameToId), // string → id
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Güncelleme başarısız");
      }

      // Frontend state’ini senkronize et
      setAllProducts((prev) =>
        prev.map((p) =>
          p.product_id === selectedProduct.product_id
            ? { ...p, suitable_for: modalSuitableFor }
            : p
        )
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Ürün güncellenemedi!");
    }
  };

  /* ================================================== */
  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <main className="main-content">
        <h2 className="section-title">
          Our registered products that we can recommend to you
        </h2>
      </main>

      {/* ---------- Dropdown Filter ---------- */}
      <div className="filter-section">
        <dl className="dropdown">
          <dt>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <span className="hida">
                {tempSelectedCategories.length
                  ? tempSelectedCategories.join(", ")
                  : "Select Product Category"}
              </span>
            </a>
          </dt>
          {isDropdownOpen && (
            <dd>
              <div className="mutliSelect">
                <ul>
                  {allCategories.map((c) => (
                    <li key={c.category_id}>
                      <label>
                        <input
                          type="checkbox"
                          value={c.category_name}
                          checked={tempSelectedCategories.includes(
                            c.category_name
                          )}
                          onChange={handleCategoryChange}
                        />{" "}
                        {c.category_name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </dd>
          )}
          <button onClick={applyFilter}>Filter</button>
          <button onClick={resetFilter} className="reset-btn">
            Reset Filter
          </button>
        </dl>
      </div>

      {/* ---------- Ürün Listesi ---------- */}
      <section className="products-section">
        <div className="products-container">
          {visibleProducts.length ? (
            visibleProducts.map((p) => (
              <button
                key={p.product_id}
                className="product-item"
                onClick={() => {
                  if (isAdmin) {
                    setSelectedProduct(p);
                    setShowModal(true);
                  }
                }}
              >
                {p.product_name}
              </button>
            ))
          ) : (
            <p className="no-products">No products match your selection.</p>
          )}
        </div>
      </section>

      {/* ---------- View More ---------- */}
      {visibleCount < filteredProducts.length && (
        <button
          className="view-more-btn"
          onClick={() => setVisibleCount((v) => v + 8)}
        >
          View More
        </button>
      )}

      {/* ---------- Admin Modal ---------- */}
      {showModal && isAdmin && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Suitable Skin Types for:</h3>
            <p>
              <strong>{selectedProduct.product_name}</strong>
            </p>

            <p>
              <em>Currently suitable for:</em>{" "}
              {modalSuitableFor.length ? modalSuitableFor.join(", ") : "None"}
            </p>

            <div className="checkbox-group">
              {Object.values(SKIN_TYPE_MAP).map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={modalSuitableFor.includes(type)}
                    onChange={handleSuitableForChange}
                  />
                  {type}
                </label>
              ))}
            </div>

            <button onClick={saveSuitableFor}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* sayfa boşluğu */}
      <div style={{ height: "1000px" }}></div>
    </div>
  );
};

export default ProductPage;
