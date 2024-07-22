import React, { useEffect } from 'react';

import { Container, Grid, Typography, Button, Link } from '@mui/material';
import { blue } from '@mui/material/colors';
import { produce } from 'immer';

import Section from '../Section';
import MovieList from '../MovieList';

import { getMovieCount } from '../../utils/resize';
import { getPopularMovies } from '../../api/movie';

const styles = {
  primary: {
    color: blue[300],
  },
};

const MOVIE_COUNT_PER_PAGE = 50;

const PopularMovies = ({ genres }) => {
  const [movies, setMovies] = React.useState([]);
  const [filter, setFilter] = React.useState({ genreId: 0, size: MOVIE_COUNT_PER_PAGE });

  useEffect(() => {
    const fetchMovies = async () => {
      const popularMovies = await getPopularMovies(filter);
      setMovies(popularMovies);
    };
    fetchMovies();

    return () => {
      setMovies([]);
    };
  }, [filter]);

  return (
    <Section id="movies" height="200vh" sx={{ backgroundColor: '#00111f' }}>
      <Container maxWidth="m" sx={{ height: '100%', padding: '100px 0 0 0' }}>
        <Typography
          variant="h6"
          component="h6"
          sx={{
            color: styles.primary.color,
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '1px',
          }}
          mb={1}
        >
          MOVIES
        </Typography>

        <Typography
          variant="h6"
          component="h6"
          sx={{
            color: '#fff',
            fontSize: '36px',
            fontWeight: '700',
            letterSpacing: '1px',
          }}
          mb={1}
        >
          Most Popular Movies
        </Typography>

        <Grid
          container
          sx={{
            width: '100%',
            height: '50px',
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: '10px',
          }}
          mb={10}
          mt={10}
        >
          {genres.map((genre) => (
            <Grid key={genre.genreId} item mr={2}>
              <Button
                underline="none"
                sx={{
                  color: '#fff',
                  backgroundColor: filter.genreId === genre.genreId && styles.primary.color,
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease-in-out',
                  border: '2px solid ' + styles.primary.color,
                  borderRadius: '5px',
                  padding: '10px',
                  ['&:hover']: {
                    color: styles.primary.color,
                  },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setFilter(
                    produce((draft) => {
                      draft.genreId = genre.genreId;
                    })
                  );
                }}
              >
                {genre.name}
              </Button>
            </Grid>
          ))}
        </Grid>
        <MovieList movies={movies} pagination={{ count: getMovieCount() }} genre={filter.genreId} />
      </Container>
    </Section>
  );
};

export default PopularMovies;
