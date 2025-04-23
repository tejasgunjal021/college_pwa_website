import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import './navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`nav ${sticky ? 'dark-nav' : ''}`}>
      <img src={logo} alt="Logo" className='logo' />

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/programs" onClick={closeMenu}>Program</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
        <li><Link to="/campus" onClick={closeMenu}>Campus</Link></li>
        <li><Link to="/testimonials" onClick={closeMenu}>Testimonials</Link></li>
        <li><Link to="/contact" onClick={closeMenu}><button className='btn'>Contact Us</button></Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
