import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#2c5530',
      padding: '1rem 0',
      position: 'fixed',
      width: '100%',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          CareTrack
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link>
          <Link to="/reports" style={{ color: 'white', textDecoration: 'none' }}>Reports</Link>
          <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact Us</Link>
          <Link to="/report" className="nav-link report-btn">Report a Dog</Link>
          <Link to="/login" style={{
            color: 'white',
            textDecoration: 'none',
            backgroundColor: '#ff6b6b',
            padding: '0.5rem 1.5rem',
            borderRadius: '25px'
          }}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;