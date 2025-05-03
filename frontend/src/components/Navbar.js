import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Glow Genie</div>
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </label>
      <ul className="navbar-links">
        <li><a href="#">Show All Skin Care Products</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="/">Home</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
