import React, { useState, useEffect } from "react";
import { usePokemonContext } from "../../PokemonContext/PokemonContext";
import PokemonCard from "../../components/PokemonCard/PokemonCard";
import "../../css/Favorite.css";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import logo from '../../logo.png'; 

function Favorite({ theme }) { 
  const { favorite } = usePokemonContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [favorite]);

  if (loading) {
    return (
      <div className={`favorite-loader ${theme}`}>
        <img src={logo} alt="Loading..." />
        <p>Loading favorites...</p>
      </div>
    );
  }

  const containerClass = `favorite-page ${theme}`;

  if (favorite.length > 0) {
    const topFavorites = favorite.slice(0,5);

    return (
      <div className={containerClass}>
        <h2>Top 5 Favorites Pokémon</h2>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{clickable:true}}
          navigation={true}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="favorite-swiper"
        > 
          {topFavorites.map((pokemon) => (
            <SwiperSlide key={pokemon.id} style={{width:"250px"}}>
              <PokemonCard pokemon={pokemon} isHomepage={false} />
            </SwiperSlide>
          ))}
        </Swiper>

        <h2>All Favorites</h2>
        <div className="pokemon-grid">
          {favorite.map((pokemon) => (
            <PokemonCard pokemon={pokemon} key={pokemon.id} isHomepage={false} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`favorite-empty ${theme}`}>
      <p>No favorite Pokémon yet! Start adding some from the homepage.</p>
    </div>
  );
}

export default Favorite;
