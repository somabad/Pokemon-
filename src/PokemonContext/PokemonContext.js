import { createContext, useState, useContext, useEffect } from "react";

const PokemonContext = createContext();

export const usePokemonContext = () => useContext(PokemonContext);

export const PokemonProvider = ({ children }) => {
  const [favorite, setFavorite] = useState([]);
  const [notes, setNotes] = useState({}); 

  useEffect(() => {
    const storedFav = localStorage.getItem("favorite");
    const storedNotes = localStorage.getItem("pokemonNotes");

    if (storedFav) setFavorite(JSON.parse(storedFav));
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, []);

  useEffect(() => {
    if (favorite.length > 0) {
      localStorage.setItem("favorite", JSON.stringify(favorite));
    }
  }, [favorite]);

 
  useEffect(() => {
    localStorage.setItem("pokemonNotes", JSON.stringify(notes));
  }, [notes]);

  const addToFavorite = (pokemon) => {
    setFavorite(prev => {
      if (prev.some(item => item.id === pokemon.id)) {
        return prev;
      }
      return [...prev, { ...pokemon, favoriteAt: Date.now()}];
    });
  };

  const removeFromFavorite = (pokemonId) => {
    setFavorite(prev => prev.filter(pokemon => pokemon.id !== pokemonId));
  };

  const isFavorite = (pokemonId) => {
    return favorite.some(pokemon => pokemon.id === pokemonId);
  };


  const savePokemonNotes = (pokemonId, nickname, comment) => {
    setNotes(prev => ({
      ...prev,
      [pokemonId]: { nickname, comment }
    }));
  };

  const value = {
    favorite,
    addToFavorite,
    removeFromFavorite,
    isFavorite,
    notes,
    savePokemonNotes
  };

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
};
