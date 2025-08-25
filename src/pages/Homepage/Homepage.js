import '../../css/HomePage.css';
import PokemonCard from '../../components/PokemonCard/PokemonCard.js'; 
import { getPopularPokemon } from '../../services/Services.js';
import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';
import logo from '../../logo.png'; 

function HomePage({ theme }) {
  const { 
    filteredPokemon, filterType,
    loading, availableTypes, setPokemons,
    setLoading, setFilterType, filterPokemons 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState(null);


  useEffect(() => {
    const loadPopularPokemon = async () => {
      setLoading(true);
      try {
        const popularPokemon = await getPopularPokemon(); 
        setPokemons(popularPokemon);
      } catch (err) {
        console.log("Error loading Pokémon:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPopularPokemon();
  }, [setPokemons, setLoading]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      setSearchResults(null);
      return;
    }

    const filtered = filteredPokemon.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 10));
    setSearchResults(filtered);
  }, [searchQuery, filteredPokemon]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setSearchResults(null);
      return;
    }
    const filtered = filteredPokemon.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setSuggestions([]);
  };

  const handleSelectSuggestion = (pokemon) => {
    setSearchQuery(pokemon.name);
    setSearchResults([pokemon]);
    setSuggestions([]);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    filterPokemons();
    setSearchResults(null);
  };

  const displayPokemon = searchResults || filteredPokemon;

  if (loading) {
    return (
      <div className={`homepage-loader ${theme}`}>
        <img src={logo} alt="Loading..." />
        <p>Loading Pokémon...</p>
      </div>
    );
  }

  return (
    <div className={`HomePage ${theme}`}>
      <div className="hero">
        <h1 className="hero-title">Welcome to the World of Pokémon!</h1> 

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search Pokémon...'
          />
          <button type="submit">🔍</button>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(p => (
                <li key={p.id} onClick={() => handleSelectSuggestion(p)}>
                  {p.name}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      <select className="search-select" value={filterType} onChange={handleFilterChange}>
        <option value="">All Types</option>
        {availableTypes.map(type => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <div className="pokemon-grid">
        {displayPokemon.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} theme={theme} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
