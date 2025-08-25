import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { usePokemonContext } from "../../PokemonContext/PokemonContext";
import "../../css/PokemonDetail.css";


import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

function PokemonDetail({ theme }) {
  const { id } = useParams();
  const { addToFavorite, removeFromFavorite, isFavorite, notes, savePokemonNotes } =
    usePokemonContext();

  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [nickname, setNickname] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPokemonById = async (pokemonIdOrName) => {
      const startTime = Date.now();
      setLoading(true);

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`);
        const data = await response.json();
        setPokemonData(data);
        fetchEvolutionChain(data.species.url);

        if (notes[data.id]) {
          setNickname(notes[data.id].nickname || "");
          setComments(notes[data.id].comments || []);
        } else {
          setNickname("");
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching Pokémon detail:", error);
      } finally {

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(800 - elapsed, 0);
        setTimeout(() => setLoading(false), remaining);
      }
    };

    const fetchEvolutionChain = async (speciesUrl) => {
      try {
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const evoResponse = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoResponse.json();
        setEvolutionChain(parseEvolutionChain(evoData.chain));
      } catch (error) {
        console.error("Error fetching evolution chain:", error);
      }
    };

    const parseEvolutionChain = (chain) => {
      const evoArray = [];
      const traverse = (node) => {
        evoArray.push({ name: node.species.name });
        node.evolves_to.forEach((evo) => traverse(evo));
      };
      traverse(chain);
      return evoArray;
    };

    fetchPokemonById(id);
  }, [id]);

  const favorite = pokemonData ? isFavorite(pokemonData.id) : false;

  const handleFavoriteClick = () => {
    if (!pokemonData) return;
    if (favorite) removeFromFavorite(pokemonData.id);
    else addToFavorite(pokemonData);
  };

  const handleAddComment = () => {
    if (!nickname || !newComment.trim()) {
      alert("Please enter nickname and comment");
      return;
    }

    const newEntry = { nickname, text: newComment };
    const updatedComments = [...comments, newEntry];

    setComments(updatedComments);
    savePokemonNotes(pokemonData.id, nickname, updatedComments);
    setNewComment("");
  };

  if (loading)
    return (
      <div className={`pokemon-detail-loader ${theme}`}>
        <img src="/logo.png" alt="Loading..." />
        <p>Loading Pokémon...</p>
      </div>
    );

  if (!pokemonData) return <div>Pokemon not found.</div>;

  const statData = pokemonData.stats.map((stat) => ({
    stat: stat.stat.name.toUpperCase(),
    value: stat.base_stat,
  }));

  return (
    <div className={`pokemon-detail-page ${theme}`}>

      <h1>{pokemonData.name.toUpperCase()}</h1>
      <div className="sprite-toggle">
        <img
          src={
            isShiny
              ? pokemonData.sprites.other["official-artwork"].front_shiny
              : pokemonData.sprites.other["official-artwork"].front_default
          }
          alt={pokemonData.name}
          className="pokemon-detail-img"
        />
        <button onClick={() => setIsShiny(!isShiny)} className="favorite-btn">
          {isShiny ? "Show Normal" : "Show Shiny"}
        </button>
      </div>

      <div className="detail-grid">
        <div className="left-col">
          <div className="info-card">
            <p>
              <strong>Height:</strong> {pokemonData.height / 10} m
            </p>
            <p>
              <strong>Weight:</strong> {pokemonData.weight / 10} kg
            </p>
          </div>

          <div className="info-card types">
            <h3>Types:</h3>
            {pokemonData.types.map((type) => (
              <span key={type.type.name} className={`type ${type.type.name}`}>
                {type.type.name}
              </span>
            ))}
          </div>

          <div className="info-card abilities">
            <h3>Abilities:</h3>
            {pokemonData.abilities.map((ability) => (
              <span key={ability.ability.name} className="ability">
                {ability.ability.name}
              </span>
            ))}
          </div>

          <div className="info-card moves">
            <h3>Moves (first 10):</h3>
            {pokemonData.moves.slice(0, 10).map((move) => (
              <span key={move.move.name} className="move">
                {move.move.name}
              </span>
            ))}
          </div>

          <div className="info-card evolution-chain">
            <h3>Evolution Chain:</h3>
            <Swiper navigation modules={[Navigation]} slidesPerView={1} className="evolution-swiper">
              {evolutionChain.map((evo) => (
                <SwiperSlide key={evo.name}>
                  <div
                    className="evolution-slide"
                    style={{ cursor: "pointer", textAlign: "center" }}
                    onClick={() => {
                      setIsShiny(false);
                      fetch(`https://pokeapi.co/api/v2/pokemon/${evo.name}`)
                        .then((res) => res.json())
                        .then((data) => setPokemonData(data));
                    }}
                  >
                    <img
                      src={`https://img.pokemondb.net/artwork/${evo.name}.jpg`}
                      alt={evo.name}
                      style={{ width: "120px", height: "120px" }}
                    />
                    <p>{evo.name}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>


        <div className="right-col">
          <div className="comment-section">
            <h3>Comments</h3>

            <input
              type="text"
              placeholder="Enter nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="favorite-btn" onClick={handleAddComment}>
              Add Comment
            </button>

            <div className="comment-list">
              {comments.length === 0 && <p>No comments yet.</p>}
              {comments.map((c, index) => (
                <div
                  key={index}
                  className="comment-item"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{c.nickname}:</strong> {c.text}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setNickname(c.nickname);
                        setNewComment(c.text);
                        setComments(comments.filter((_, i) => i !== index));
                      }}
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const updated = comments.filter((_, i) => i !== index);
                        setComments(updated);
                        savePokemonNotes(pokemonData.id, nickname, updated);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-chart">
            <h3>Stats:</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={statData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name={pokemonData.name}
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Favorite Button --- */}
      <div className="favorite-btn-container">
        <button onClick={handleFavoriteClick} className="favorite-btn">
          {favorite ? "Remove from Favorite" : "Add to Favorite"}
        </button>
      </div>
    </div>
  );
}

export default PokemonDetail;
