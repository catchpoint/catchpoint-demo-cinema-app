import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button, Card, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, List, ListItem, Pagination, PaginationItem, TextField, Typography } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckIcon from '@mui/icons-material/Check';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

import { addComment, addFavoriteMovie, checkFavoriteMovie, deleteComment, getMovie, getMovieCast, getMovieComments, removeFavoriteMovie } from '../../api/movie';
import Section from '../../components/Section';

import './MovieDetails.css';
import { deepOrange, purple } from '@mui/material/colors';
import { useApplication } from '../../context';
import { convertDate, getHourAndMinute } from '../../utils/date';
import MovieCommentDialog from './MovieCommentDialog';
import CastDialog from './CastDialog';
import { loadUser } from '../../utils/localStorage';

const COMMENTS_PER_PAGE = 6;

const MovieDetails = () => {
  const path = useParams();
  const [movie, setMovie] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [castDialogOpen, setCastDialogOpen] = React.useState(false);

  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [commentPage, setCommentPage] = React.useState(1);
  const [commentCount, setCommentCount] = React.useState(0);

  const [isFavorite, setIsFavorite] = React.useState(false);

  const [forceUpdate, setForceUpdate] = React.useState(false);

  const handleCommentClose = async (e) => {
    e.preventDefault();

    if (e.target.ariaLabel === 'yes') {
      await addComment(path.id, comment);
      setComment('');
      setForceUpdate(!forceUpdate);
    }

    setOpen(false);
  };

  useEffect(() => {
    const fetchMovie = async () => {
      const movie = await getMovie(path.id);
      const isFavorite = await checkFavoriteMovie(movie.movieId);
      
      setIsFavorite(isFavorite.length > 0);
      setMovie(movie);
    };

    fetchMovie();
  }, [path.id]);

  useEffect(() => {
    const fetchFavorite = async () => {
      const isFavorite = await checkFavoriteMovie(movie.movieId);
      setIsFavorite(isFavorite.length > 0);
    };

    fetchFavorite();
  }, [forceUpdate]);

  useEffect(() => {
    const fetchComments = async () => {
      const [count, comments] = await getMovieComments(path.id, {
        page: commentPage,
        size: COMMENTS_PER_PAGE,
      });

      setComments(comments);
      setCommentCount(count);
    };

    fetchComments();
  }, [path.id, commentPage, forceUpdate]);

  return (
    <Section height="100vh" bgImage={movie?.backdropPath ? `https://image.tmdb.org/t/p/original${movie.backdropPath}` : `../no-image.jpg`} opacity={0.3}>
      <Grid
        container
        spacing={5}
        pt={10}
        sx={{
          height: '100%',
        }}
      >
        <Grid item xs={12} md={3} display="flex" justifyContent="center">
          <img src={movie?.posterPath ? `https://image.tmdb.org/t/p/original${movie.posterPath}` : `../no-image.jpg`} alt={movie?.title} className="movie-details__poster" />
        </Grid>
        <Grid item xs={12} md={9}>
          <Typography
            variant="h2"
            pr={2}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              color: '#fff',
              maxWidth: '80%',
            }}
          >
            {movie?.title}
          </Typography>

          <Typography
            variant="h5"
            pr={2}
            pt={3}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              color: '#fff',
              textAlign: 'justify',
              maxWidth: '80%',
            }}
          >
            {movie?.overview}
          </Typography>

          <Grid
            container
            sx={{
              width: '100%',
              height: '50px',
              fontSize: '14px',
              fontWeight: '700',
            }}
            pt={3}
          >
            <Grid item sx={{ width: 'max-content' }} mr={2}>
              <span className="movie-details pegi">{movie?.language?.toUpperCase()}</span>
            </Grid>
            <Grid item sx={{ width: 'max-content' }} mr={2}>
              <span className="movie-details quality">{movie?.rating * 10}%</span>
            </Grid>
            <Grid item sx={{ width: 'max-content' }} mr={2}>
              <span className="movie-details">{movie?.genres.map((genre) => genre.name).join(', ')}</span>
            </Grid>
            <Grid item sx={{ width: 'max-content' }} mr={1}>
              <span className="movie-details">
                <CalendarMonthIcon sx={{ fontSize: '18px' }} />
                {convertDate(movie?.releaseDate).getFullYear()}
              </span>
            </Grid>
            <Grid item sx={{ width: 'max-content' }} mr={1}>
              <span className="movie-details">
                <ScheduleIcon sx={{ fontSize: '18px' }} />
                {getHourAndMinute(movie?.runtime)}
              </span>
            </Grid>
          </Grid>

          <Grid display="flex" gap={2} pt={3}>
            <Button
              variant="contained"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                backgroundColor: purple[500],
                maxWidth: '80%',
                ['&:hover']: {
                  backgroundColor: purple[700],
                },
              }}
              href={useApplication().isAuth ? '/checkout/' + movie?.movieId : '/login'}
            >
              <ConfirmationNumberIcon sx={{ mr: 1 }} />
              Buy Ticket
            </Button>

            <Button
              variant="contained"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
              }}
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => setOpen(true)}
            >
              Write a Comment
            </Button>
            <Button
              variant="contained"
              sx={{
                color: isFavorite ? deepOrange[500] : '#fff',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                backgroundColor: isFavorite ? '#fff' : deepOrange[500],
                maxWidth: '80%',
                ['&:hover']: {
                  backgroundColor: isFavorite ? '#fff' : deepOrange[700],
                },
              }}
              onClick={() => {
                if (loadUser() == null) {
                  window.location.href = '/login';
                }

                if (isFavorite) {
                  removeFavoriteMovie(movie.movieId);
                } else {
                  addFavoriteMovie(movie.movieId);
                }
                setForceUpdate(!forceUpdate);
              }}
              data-isfavorite={isFavorite}
            >
              {isFavorite ? <CheckIcon sx={{ mr: 1 }} /> : <FavoriteIcon sx={{ mr: 1 }} />}
              {isFavorite ? 'Added to Favorite' : 'Add to Favorite'}
            </Button>
            <Button
              variant="contained"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                backgroundColor: '#FF6F91',
              }}
              startIcon={<PersonIcon />}
              onClick={() => setCastDialogOpen(true)}
            >
              Show Cast
            </Button>
          </Grid>
          <Grid container spacing={2}>
            {comments && comments.length > 0 && (
              <>
                <Grid item xs={12} pt={5} mt={3}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    Comments
                  </Typography>
                  <List
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      overflowX: 'scroll',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      maxHeight: '500px',
                      width: '100%',
                    }}
                  >
                    {comments?.map((comment) => (
                      <ListItem
                        key={comment?.commentId}
                        sx={{
                          width: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: 0,
                        }}
                      >
                        <Card sx={{ width: '100%', padding: '10px', backgroundColor: '#171d22', color: '#fff' }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 600,
                              color: '#fff',
                            }}
                          >
                            {comment?.username}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              fontWeight: 400,
                              color: '#fff',
                            }}
                            maxWidth={'90%'}
                            textOverflow={'ellipsis'}
                            overflow={'hidden'}
                            whiteSpace={'nowrap'}
                          >{comment?.comment}</Typography>
                          {loadUser()?.username === comment?.username && (
                            <Button
                              variant="contained"
                              sx={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 600,
                                marginTop: '10px',
                                right: '10px',
                                top: '5px',
                                position: 'absolute',
                              }}
                              color="error"
                              onClick={async () => {
                                await deleteComment(comment?.commentId);
                                setForceUpdate(!forceUpdate);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </Card>
                      </ListItem>
                    ))}
                    <Pagination
                      count={Math.ceil(commentCount / COMMENTS_PER_PAGE)}
                      color="primary"
                      onChange={(e, page) => setCommentPage(page)}
                      variant="outlined"
                      shape="rounded"
                      sx={{ marginTop: '10px' }}
                      renderItem={(item) => {
                        item.color = 'primary';
                        item.sx = {
                          color: '#fff',
                          borderColor: '#fff',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          ['&.Mui-selected']: {
                            backgroundColor: '#FF6F91',
                            color: '#fff',
                          },
                        };

                        return <PaginationItem {...item} />;
                      }}
                    />
                  </List>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <MovieCommentDialog open={open} handleClose={handleCommentClose} title={'Write a Comment'}>
        <Grid container spacing={2} sx={{ width: '400px !important' }} pt={2}>
          <Grid item xs={12}>
            <IconButton
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
              }}
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <TextField id="outlined-multiline-static" label="Comment" multiline rows={4} fullWidth value={comment} onChange={(e) => setComment(e.target.value)} />
          </Grid>
        </Grid>
      </MovieCommentDialog>

      <CastDialog
        open={castDialogOpen}
        handleClose={() => {
          setCastDialogOpen(false);
        }}
        title={
          <>
            <b>{movie?.title}</b> <span style={{ marginLeft: '3px' }}> Cast </span>
          </>
        }
      >
        {movie?.cast && movie.cast.length > 0 && (
          <>
            <Grid
              container
              spacing={5}
              p={3}
              sx={{
                width: '100%',
                height: '500px',
                fontSize: '14px',
                fontWeight: '700',
                margin: 'auto',
              }}
            >
              <ImageList
                sx={{
                  width: '100%',
                  height: '100%',
                  gap: '5px',
                  overflowX: 'scroll',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {movie.cast?.map((cast) => (
                  <ImageListItem key={cast?.personId}>
                    <img src={cast?.profilePath ? `https://image.tmdb.org/t/p/original${cast.profilePath}` : `../no-image.jpg`} alt={cast?.name} style={{ objectFit: 'cover' }} loading="lazy" />
                    <ImageListItemBar title={cast?.name} subtitle={cast?.character} />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </>
        )}
      </CastDialog>
    </Section>
  );
};

export default MovieDetails;
