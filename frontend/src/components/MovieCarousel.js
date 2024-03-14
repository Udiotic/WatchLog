import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const apiKey = 'a26cfd760b8de60d041bdc062f4ff9a7'; // Replace with your actual API key

function MovieCarousel() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
      const data = await response.json();
      setTrendingMovies(data.results);
      setIsLoading(false);
    };
    fetchMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4, // Adjust to show desired number of movies per row
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="movie-carousel">
      <h2>Trending Movies</h2>
      {isLoading ? (
        <p>Loading Movies...</p>
      ) : trendingMovies.length > 0 ? (
        <Slider {...settings}>
          {trendingMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <p>No Image Available</p>
              )}
              <p>{movie.title}</p>
            </div>
          ))}
        </Slider>
      ) : (
        <p>No movies found.</p>
      )}
    </div>
    
  );
}

export default MovieCarousel;
