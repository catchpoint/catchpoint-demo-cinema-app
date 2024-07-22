import React, { memo } from 'react';
import { Grid, Link, Pagination, PaginationItem } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import MovieCard from '../MovieCard';

import { useApplication } from '../../context';

import { handleScroll } from '../../utils/resize';
import { blue } from '@mui/material/colors';

const MovieList = ({ movies, genre, pagination, props }) => {
  const context = useApplication();
  return (
    <>
      <Grid
        container
        maxWidth="m"
        {...props}
        sx={{
          alignItems: 'start',
          justifyContent: 'flex-start',
          width: '100%',
          heigth: 'auto',
          maxHeight: '80%',
          display: 'flex',
          flexWrap: 'wrap',

          rowGap: '30px',
          columnGap: '15px',
          overflow: 'scroll',

          ['&::-webkit-scrollbar']: {
            width: '0.4em',
          },
          ['&::-webkit-scrollbar-track']: {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          },
          ['&::-webkit-scrollbar-thumb']: {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
          },
        }}
        onScroll={(e) => handleScroll(e.target.scrollTop > 0, context)}
      >
        {movies && movies.map((movie) => <MovieCard movie={movie} key={movie.movieId} favorite={movie.favorite} />)}
      </Grid>
      <Grid container justifyContent="space-evenly" alignItems="center">
        {pagination && pagination.page && pagination.count ? (
          <Pagination
            color="primary"
            count={Math.ceil(pagination.count / 50)}
            page={pagination.page}
            onChange={(_, page) => pagination.setPage(page)}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  backgroundColor: '#fff',
                  border: 'none',
                  ['&:hover']: {
                    backgroundColor: '#fafafa',
                  },
                }}
              />
            )}
            sx={{
              position: 'absolute',
              width: '90%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
            }}
          />
        ) : (
          <Link
            href={`/movies?genre=${genre ? genre : '0'}`}
            underline="none"
            sx={{
              fontSize: '15px',
              fontWeight: '500',
              backgroundColor: '#fff',
              padding: '8px',
              borderRadius: '5px',
              transition: 'all 0.3s ease-in-out',
              marginTop: '20px',

              ['&:hover']: {
                backgroundColor: blue[500],
                color: '#fff',
              },

              display: 'flex',
              alignItems: 'center',
            }}
          >
            <FormatListBulletedIcon sx={{ mr: 1 }} />
            See more
          </Link>
        )}
      </Grid>
    </>
  );
};

export default memo(MovieList);
