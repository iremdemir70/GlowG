import React, { useState, useEffect } from "react";
import "./Navbar.css"; // CSS dosyanın yolu bu olabilir, emin ol

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return(
<nav className={`nav ${scrolled ? "affix" : ""}`}>
  <div className="logo">
    <a href="/">GlowGenie</a>
  </div>
  <div className={`navlinks ${menuOpen ? "open" : ""}`}>
  <li><a href="#" className="btn-info">About</a></li>
  <li><a href="#" className="btn-info">Contact</a></li>
  <li><a href="#" className="btn-info">Home Page</a> </li>
          
  </div>
  <div className="navTrigger" onClick={handleToggle}>
    <span></span>
    <span></span>
    <span></span>
  </div>
</nav>

  );
};

export default Navbar;
/*
  return (
    <nav className={`nav ${scrolled ? "affix" : ""}`}>
      <div className="container">
        <div className="logo">
          <a href="#">Glow Genie</a>
        </div>
        <div id="mainListDiv" className={`main_list ${menuOpen ? "show_list" : ""}`}>
          <ul className="navlinks">
            <li><a href="#" className="btn-info">About</a></li>
            <li><a href="#" className="btn-info">Contact</a></li>
            <li>
              <button className="btn" onClick={() => window.location.href = "index.html"}>
                <i className="fa fa-home"></i>
              </button>
            </li>
          </ul>
        </div>
        <span className={`navTrigger ${menuOpen ? "active" : ""}`} onClick={handleToggle}>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
    </nav>
  );*/
 /*          <li>
              <button className="btn" onClick={() => window.location.href = "index.html"}>
                <i className="fa fa-home"></i>
              </button>
            </li> */