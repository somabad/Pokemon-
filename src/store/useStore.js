import { create } from 'zustand';

const useStore = create((set, get) => ({
  pokemons: [],
  filteredPokemon: [],
  selectedPokemon: null,
  searchQuery: '',
  searchResults: null,
  suggestions: [],
  loading: false,
  filterType: '',
  editedPokemon: {},
  availableTypes: [],

  setPokemons: (data) => {
    const types = [...new Set(data.flatMap(p => p.types.map(t => t.type.name)))];
    set({ 
      pokemons: data, 
      filteredPokemon: data, 
      availableTypes: types 
    });
  },

  setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),

  setSearchQuery: (query) => {
    const { pokemons } = get();
    // Buat suggestion list max 10
    const suggestions = query
      ? pokemons.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
      : [];
    set({ searchQuery: query, suggestions });
  },

  handleSearch: () => {
    const { searchQuery, pokemons } = get();
    if (!searchQuery) {
      set({ searchResults: null });
      return;
    }
    const results = pokemons.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    set({ searchResults: results, suggestions: [] });
  },

  selectSuggestion: (pokemon) => {
    set({
      searchQuery: pokemon.name,
      searchResults: [pokemon],
      suggestions: []
    });
  },

  clearSearch: () => set({ searchQuery: '', searchResults: null, suggestions: [] }),

  setLoading: (isLoading) => set({ loading: isLoading }),
  setFilterType: (type) => set({ filterType: type }),

  filterPokemons: () => {
    const { pokemons, searchQuery, filterType } = get();
    let filtered = pokemons;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter(p =>
        p.types.some(t => t.type.name === filterType)
      );
    }

    set({ filteredPokemon: filtered });
  },

  updatePokemon: (name, updates) =>
    set((state) => ({
      editedPokemon: {
        ...state.editedPokemon,
        [name]: { ...state.editedPokemon[name], ...updates },
      },
    })),
}));

export default useStore;
