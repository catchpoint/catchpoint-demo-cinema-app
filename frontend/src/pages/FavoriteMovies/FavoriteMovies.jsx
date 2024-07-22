import React from 'react';
import Section from '../../components/Section';
import MovieList from '../../components/MovieList';
import { getFavoriteMovies } from '../../api/movie';

const FavoriteMovies = () => {
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    const fetchMovies = async () => {
      const movies = await getFavoriteMovies();
      setMovies(movies);
    };
    fetchMovies();

    return () => {
      setMovies([]);
    };
  }, []);

  return (
    <Section id="movies" height="100vh" sx={{ backgroundColor: '#00111f', padding: '50px' }}>
      <MovieList movies={movies} />
    </Section>
  );
};

export default FavoriteMovies;
