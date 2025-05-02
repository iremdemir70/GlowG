import React, { useEffect, useState } from 'react';
import './Navbar.css';  
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'affix' : ''}`}>
      <div className="navTrigger" onClick={() => setActive(!active)}>
        <i className="fa fa-bars"></i>
      </div>
      <div id="mainListDiv" className={`main_list ${active ? 'show_list' : ''}`}>
        <ul className="navlinks">
          <li><a href="/">Home</a></li>
          <li><Link to="/products">Products</Link></li>
        <li><a href="/register">Register</a></li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;