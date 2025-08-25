import '../../css/Navbar.css';
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';

function Navbar({ searchQuery, setSearchQuery, handleSearch, theme, toggleTheme, suggestions }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`navbar ${theme}`}>
      <div className='navbar-brand'>
        <Link to="/">
          <img src="/logo.png" alt="logo" className='logo' />
        </Link>
      </div>

      <div className="navbar-right">
        <div className='navbar-links'>
          <Link to="/" className="nav-link">HomePage</Link>
          <Link to="/favorite" className="nav-link">Favorite</Link>
        </div>    

        <div className="mode-toggle">
          <label className="switch">
            <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
            <span className="slider round"></span>
          </label>
          <span>{theme === "dark" ? "🌙 Night" : "☀️ Day"}</span>
        </div>

        <form onSubmit={handleSearch} className="navbar-search" ref={searchRef}>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);  
            }}
            placeholder="Search Pokémon..."
          />
          <button type="submit">🔍</button>

          {showSuggestions && suggestions && suggestions.length > 0 && (
            <div className="suggestions-list">
              {suggestions.map((p, idx) => {
                const id = p.url ? p.url.split("/")[6] : p.id;
                return (
                  <div 
                    key={idx} 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(p.name);
                      setShowSuggestions(false); 
                    }}
                  >
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} 
                      alt={p.name} 
                    />
                    <span>{p.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
