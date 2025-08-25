

let allPokemonCache = null;

export const getPopularPokemon = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
    const data = await response.json();

    const detailedPokemon = await Promise.all(
      data.results.map(async (p) => {
        const res = await fetch(p.url);
        return await res.json();
      })
    );

    allPokemonCache = detailedPokemon;

    return detailedPokemon; 
  } catch (error) {
    console.error("Error fetching popular Pokémon:", error);
    throw error;
  }
};

export const searchPokemon = async (query) => {
  try {
    if (!allPokemonCache) {
      await getPopularPokemon();
    }

    const filtered = allPokemonCache.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered; 
  } catch (error) {
    console.error("Error searching for Pokémon:", error);
    throw error;
  }
};
