import React, { useState, useEffect } from 'react';
import '../../css/PokemonCard.css';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../PokemonContext/PokemonContext';
import { FaRegHeart } from "react-icons/fa";

function PokemonCard({ pokemon, isPokemonDetail }) {
  const { addToFavorite, removeFromFavorite, isFavorite } = usePokemonContext();
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        if (pokemon.sprites) {
          setPokemonData(pokemon);
          return;
        }

        let url = pokemon.url 
          ? pokemon.url 
          : `https://pokeapi.co/api/v2/pokemon/${pokemon.id || pokemon.name}`;

        const response = await fetch(url);
        const data = await response.json();
        setPokemonData(data);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    };

    fetchPokemonDetails();
  }, [pokemon]);

  if (!pokemonData) return <p>Loading...</p>;

  const favorite = isFavorite(pokemonData.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (favorite) {
      removeFromFavorite(pokemonData.id);
    } else {
      addToFavorite(pokemonData);
    }
  };

  const spriteUrl =
    pokemonData.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
    pokemonData.sprites?.other?.['official-artwork']?.front_default ||
    pokemonData.sprites?.front_default ||
    'fallback-image-url';

  return (
    <div className="pokemon-card">
      <div className="pokemon-picture" style={{ position: 'relative' }}>
        <Link to={`/pokemon/${pokemonData.id}`}>
          <img
            src={spriteUrl}
            alt={pokemonData.name}
            className="main-picture"
          />
        </Link>

        <button 
          className="favorite-button" 
          onClick={handleFavoriteClick}
        >
          <FaRegHeart color={favorite ? "red" : "white"} size={24} />
        </button>
      </div>

      {!isPokemonDetail && (
        <div className="pokemon-detail">
          <h3>{pokemonData.name}</h3>
        </div>
      )}

      {isPokemonDetail && (
        <div className="pokemon-detail">
          <h3>{pokemonData.name}</h3>
          <p>Types: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
          <p>Abilities: {pokemonData.abilities.map(ability => ability.ability.name).join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default PokemonCard;
