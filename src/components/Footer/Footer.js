import React from 'react';
import '../../css/Footer.css';
import { Link } from 'react-router-dom';


//display in the footer
function Footer({ theme }) {
  return (
    <footer className={`footer ${theme}`}>
      <p>&copy; 2025 Pokémon Encyclopedia. All rights reserved.</p>
      <p>
        <a 
          href="https://pokeapi.co" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="footer-link"
        >
          Data provided by PokeAPI
        </a>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/favorite">Favorite</Link>
        </div>
      </p>
    </footer>
  );
}

export default Footer;
