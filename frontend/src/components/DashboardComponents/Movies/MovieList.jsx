import React, { useEffect, useState } from 'react';
import { createMovie, deleteMovie, getMovieCount, getMovieCountByQuery, getMovies, updateMovie } from '../../../api/movie';

import { Button, Chip, Grid, Pagination, PaginationItem, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import CustomTableCell from '../CustomTableCell';
import { convertDate, getHourAndMinute } from '../../../utils/date';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import EditMovie from './EditMovie';
import CustomDialog from '../../CustomDialog/CustomDialog';
import { search } from '../../../api/movie';
import ReportDownload from '../../ReportDownload';
import { addNewLine } from '../../../utils/string';

const MOVIE_PER_PAGE = 20;

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [actionMovie, setActionMovie] = useState({});
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [query, setQuery] = useState('');

  const [action, setAction] = useState('UPDATE');

  const [forceUpdate, setForceUpdate] = useState(false);
  const toggleForceUpdate = () => setForceUpdate(!forceUpdate);

  useEffect(() => {
    const fetchMovies = async () => {
      if (query && query !== '') {
        const movies = await search({ query, page, size: MOVIE_PER_PAGE });
        const count = await getMovieCountByQuery(query);
        setMovies(movies);
        setCount(count);
      } else {
        const res = await getMovies({ page, size: MOVIE_PER_PAGE });
        const count = await getMovieCount(0);
        setMovies(res);
        setCount(count);
      }
    };
    fetchMovies();

    return () => {
      setMovies([]);
      setCount(0);
    };
  }, [page, forceUpdate, query]);

  const handleUpdate = async (movie) => {
    if (action === 'CREATE') {
      await createMovie(movie);
    } else {
      await updateMovie(movie);
    }

    toggleForceUpdate();
  };

  const handleDelete = async (movie) => {
    await deleteMovie(movie.movieId);
    toggleForceUpdate();
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <h3 style={{ color: '#fff' }}>Movies</h3>
        </Grid>
        <Grid item xs={6}>
          <div className="search-box">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setQuery(e.target[0].value);
              }}
            >
              <input
                type="text"
                placeholder="Search"
                style={{
                  borderRadius: '3px 0 0 3px',
                }}
              />
              <Button
                type="submit"
                sx={{
                  color: '#171d22',
                  background: 'transparent',
                  padding: '0',
                }}
              >
                <SearchIcon
                  sx={{
                    background: '#f0f0f0',
                    height: '41px',
                    width: '100%',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              </Button>
            </form>
          </div>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="info"
            sx={{ marginBottom: 2, float: 'right', padding: '12px' }}
            startIcon={<AddIcon />}
            onClick={() => {
              setAction('CREATE');
              setActionMovie({});
              setOpen(true);
            }}
          >
            Create New Movie
          </Button>
        </Grid>
        <Grid item xs={2}>
          <ReportDownload
            dataHandler={getMovies({ page: page, size: MOVIE_PER_PAGE })}
            sx={{ marginBottom: 2, float: 'right', padding: '12px', width: '100%' }}
            map={(movie) => {
              return {
                'Movie Id': movie.movieId,
                Title: movie.title,
                Runtime: getHourAndMinute(movie?.runtime),
                'Release Date': convertDate(movie?.releaseDate).getFullYear(),
                Rating: movie.rating.toFixed(1),
                'Backdrop Image Key \n\n Poster Image Key \n\n Trailer Link': movie.backdropPath + '\n\n' + movie.posterPath + '\n\n' + movie.trailerLink,
                Keywords: addNewLine(movie.keywords, 30),
                Genre: addNewLine(movie.genres.map((genre) => genre.name).join(', '), 30),
              };
            }}
            txt={'Download Movie Report'}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2, backgroundColor: '#051d32', maxHeight: '95%' }}>
        <Table sx={{ minWidth: 700 }} stickyHeader>
          <TableHead>
            <TableRow>
              <CustomTableCell width="5%">
                <b>Movie Id</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Title</b>
              </CustomTableCell>
              <CustomTableCell width="20%">
                <b>Overview</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Runtime</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Release Date</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Rating</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Backdrop Image Key</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Poster Image Key</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Trailer Url</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Country</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Language</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Keywords</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Genre</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Actions</b>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflow: 'scroll' }}>
            {movies?.map((movie) => (
              <TableRow key={movie.movieId} sx={{ border: 'none' }} hover={true}>
                <CustomTableCell component="th" scope="row">
                  {movie.movieId}
                </CustomTableCell>
                <CustomTableCell>{movie.title}</CustomTableCell>
                <CustomTableCell
                  sx={{
                    minWidth: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {movie.overview}
                </CustomTableCell>

                <CustomTableCell>{getHourAndMinute(movie?.runtime)}</CustomTableCell>
                <CustomTableCell>{convertDate(movie?.releaseDate).getFullYear()}</CustomTableCell>
                <CustomTableCell>{movie.rating.toFixed(1)}</CustomTableCell>
                <CustomTableCell>{movie.backdropPath}</CustomTableCell>
                <CustomTableCell>{movie.posterPath}</CustomTableCell>
                <CustomTableCell>{movie.trailerLink}</CustomTableCell>
                <CustomTableCell>{movie.country}</CustomTableCell>
                <CustomTableCell>{movie.language}</CustomTableCell>

                <CustomTableCell sx={{ minWidth: 200 }}>{movie.keywords}</CustomTableCell>
                <CustomTableCell sx={{ minWidth: 200 }}>{movie.genres.map((genre) => genre.name).join(', ')}</CustomTableCell>
                <CustomTableCell sx={{ minWidth: 300 }}>
                  <Grid container spacing={1} flexDirection="row">
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setAction('UPDATE');
                          setActionMovie(movie);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => {
                          setActionMovie(movie);
                          setOpenDelete(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          color="primary"
          count={Math.ceil(count / MOVIE_PER_PAGE)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
          }}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                color: '#fff',
                backgroundColor: '#051d32',
                '&:hover': {
                  backgroundColor: '#051d32',
                },
              }}
            />
          )}
        />
      </TableContainer>

      {(actionMovie?.movieId || action === 'CREATE') && (
        <>
          <EditMovie movie={actionMovie} open={open} setOpen={setOpen} handleUpdate={handleUpdate} action={action} />
          <CustomDialog
            open={openDelete}
            type={'yesno'}
            setOpen={setOpenDelete}
            title={`Delete Movie ${actionMovie?.title}?`}
            content={`Are you sure you want to delete ${actionMovie?.title}?`}
            handleClose={(e) => {
              if (e.target.ariaLabel === 'yes') {
                handleDelete(actionMovie);
              }
              setOpenDelete(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default MovieList;
