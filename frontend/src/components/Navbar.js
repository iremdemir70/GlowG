
import React from 'react';
import './Navbar.css'; // CSS dosyanı buraya bağla

const Navbar = () => {
  return (
    <div className="nav">
      <input type="checkbox" id="nav-check" />
      
      <div className="nav-header">
        <a href="#" className="logo">Glow Genie</a>
      </div>

      <div className="nav-btn">
        <label htmlFor="nav-check">
          <span></span>
          <span></span>
          <span></span>
        </label>
      </div>

      <div className="nav-links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Home Page</a>
    
      </div>
    </div>
  );
};

export default Navbar;

