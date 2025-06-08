import React from 'react';
import { FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'
const Navbar = ({ isScrolled, menuOpen, toggleMenu, goToHomePage }) => {
  return (
    <nav className={`nav ${isScrolled ? 'affix' : ''}`}>
      <div className="container">
        <div className="logo"><a href="#">Glow Genie</a></div>

        <div id="mainListDiv" className={`main_list ${menuOpen ? 'show_list' : ''}`}>
          <ul className="navlinks">
            <li>
              <Link to="/product-page" className="btn-info bordered-link">
                Show All Skin Care Products
              </Link>
            </li>
            <li><a href="#" className="btn-info">About</a></li>
            <li><a href="#" className="btn-info">Contact</a></li>
            <li className="home">
              <button className="btn" onClick={goToHomePage}>
                <FaHome className="home-icon" />
                <span className="home-text">Home</span>
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

export default Navbar;
