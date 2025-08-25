import React, { useState, useEffect } from 'react';
import './css/App.css';  
import { Routes, Route, BrowserRouter as Router, useNavigate } from 'react-router-dom';  
import Navbar from './components/Navbar/Navbar.js';  
import HomePage from './pages/Homepage/Homepage.js'; 
import Favorite from './pages/Favorite/Favorite.js';
import { PokemonProvider } from './PokemonContext/PokemonContext.js'
import PokemonDetail from './pages/PokemonDetail/PokemonDetail.js';
import Footer from './components/Footer/Footer.js';

// Wrapper supaya kita boleh guna useNavigate
function AppWrapper() {
  return (
    <PokemonProvider>
      <Router>
        <App />
      </Router>
    </PokemonProvider>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState("light"); 
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  // Fetch suggestions when typing
  useEffect(() => {
    if (searchQuery.length > 0) {
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.results.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSuggestions(filtered.slice(0, 5)); // show top 5
        });
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate ke Pokemon Detail
    navigate(`/pokemon/${searchQuery.toLowerCase()}`);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Navbar 
  searchQuery={searchQuery} 
  setSearchQuery={setSearchQuery} 
  handleSearch={handleSearch} 
  theme={theme} 
  toggleTheme={toggleTheme}
  suggestions={suggestions}
  onSelectSuggestion={(pokemon) => {
    setSearchQuery(pokemon.name);
    setSuggestions([]); // hide dropdown lepas klik
  }}
/>

      <div className={`app-wrapper ${theme}`}>
        <Routes>
          <Route path="/" element={
            <HomePage 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              handleSearch={handleSearch} 
              theme={theme}
            />
          } />
          <Route path="/pokemon/:id" element={<PokemonDetail theme={theme} />} />
          <Route path="/Favorite" element={<Favorite theme={theme} />} />
        </Routes>
      </div>
      <Footer theme={theme} />
    </>
  );
}

export default AppWrapper;
