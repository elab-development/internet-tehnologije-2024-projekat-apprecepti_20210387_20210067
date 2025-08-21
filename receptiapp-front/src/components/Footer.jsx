import React from 'react';
import { FaInstagram, FaFacebook, FaArrowUp } from 'react-icons/fa';


const Footer = () => {
  const scrollToTop = () => {
    const rootElement = document.querySelector('#root');
    if (rootElement) {
      rootElement.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/images/receptoria.png" alt="Receptoria Logo" className="footer-logo" />
      </div>

      <div className="footer-right">
        <div className="footer-socials">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaInstagram size={30} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaFacebook size={30} />
          </a>
        </div>

        <button onClick={scrollToTop} className="footer-top-button">
          <FaArrowUp size={20} /> Na vrh
        </button>
      </div>
    </footer>
  );
};

export default Footer;

