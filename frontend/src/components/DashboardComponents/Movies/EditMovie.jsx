import React, { useEffect, useState } from 'react';
import { produce } from 'immer';

import { Modal, Box, Paper, Grid, Button, TextField, Typography, IconButton, InputAdornment, Select, MenuItem, Chip, List, Checkbox } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { equals } from '../../../utils/object';
import dayjs from 'dayjs';
import ApplicationContext from '../../../context';

const EditMovie = ({ movie, open, setOpen, handleUpdate, ...props }) => {

  const [actionMovie, setActionMovie] = useState({
    genres: [],
  });

  const handleChange = (key, value) => {
    setActionMovie(
      produce(actionMovie, (draft) => {
        draft[key] = value;
      })
    );
  };

  useEffect(() => {
    setActionMovie(props?.action === 'UPDATE' ? movie : {
      genres: [],
    });

    return () => {
      setActionMovie({});
    };
  }, [open]);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -40%)',
        }}
      >
        <Paper sx={{ p: 2, width: '600px', height: 'max-content' }}>
          <Grid
            container
            spacing={2}
            sx={{
              overflow: 'scroll',
              maxHeight: '700px',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Edit Movie
              </Typography>
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
                sx={{ float: 'right' }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={actionMovie.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Overview"
                variant="outlined"
                value={actionMovie.overview || ''}
                onChange={(e) => handleChange('overview', e.target.value)}
                multiline
                rows={4}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Runtime"
                variant="outlined"
                value={actionMovie.runtime || 0}
                onChange={(e) => handleChange('runtime', e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
                  inputProps: {
                    min: 0,
                    max: 600,
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Release Date"
                variant="outlined"
                type="date"
                value={dayjs(actionMovie.releaseDate || dayjs()).format('YYYY-MM-DD')}
                onChange={(e) => handleChange('releaseDate', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rating"
                variant="outlined"
                value={parseFloat(actionMovie.rating || 0).toFixed(1)}
                onChange={(e) => handleChange('rating', e.target.value)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                  step: '0.1',
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">/10</InputAdornment>,
                  inputProps: {
                    min: 0,
                    max: 10,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Backdrop Image Key"
                    variant="outlined"
                    value={actionMovie.backdropPath || ''}
                    onChange={(e) => handleChange('backdropPath', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Poster Image Key"
                    variant="outlined"
                    value={actionMovie.posterPath || ''}
                    onChange={(e) => handleChange('posterPath', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trailer Url"
                variant="outlined"
                value={actionMovie.trailerUrl || ''}
                onChange={(e) => handleChange('trailerUrl', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    variant="outlined"
                    value={actionMovie.country || ''}
                    onChange={(e) => handleChange('country', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Language"
                    variant="outlined"
                    value={actionMovie.language || ''}
                    onChange={(e) => handleChange('language', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Keywords"
                    variant="outlined"
                    value={actionMovie.keywords || ''}
                    onChange={(e) => handleChange('keywords', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <ApplicationContext.Consumer>
                {({ genres }) => (
                  <Select
                    fullWidth
                    label="Genre"
                    variant="outlined"
                    multiple
                    value={actionMovie.genres.length > 0 ? actionMovie.genres : []}
                    onOpen={() => {}}
                    renderValue={(selected) =>
                      selected &&
                      selected.map((genre) => (
                        <Chip
                          color="info"
                          key={genre.genreId}
                          label={genre.name}
                          sx={{ margin: '0 5px 5px 0' }}
                          clickable
                          deleteIcon={<CloseIcon onMouseDown={(event) => event.stopPropagation()} />}
                          onDelete={(e) => {
                            e.preventDefault();
                            if (actionMovie.genres.length === 1) {
                              return;
                            }
                            setActionMovie(
                              produce(actionMovie, (draft) => {
                                draft.genres = draft.genres.filter((g) => genre.genreId !== g.genreId);
                              })
                            );
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      ))
                    }
                  >
                    {genres
                      .filter((g) => g.genreId !== 0)
                      .map((genre) => {
                        return (
                          <MenuItem
                            key={genre.genreId}
                            value={genre}
                            dense
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              if (actionMovie.genres.map((g) => g.genreId).includes(genre.genreId)) {
                                setActionMovie(
                                  produce(actionMovie, (draft) => {
                                    draft.genres = draft.genres.filter((g) => genre.genreId !== g.genreId);
                                  })
                                );
                              } else {
                                setActionMovie(
                                  produce(actionMovie, (draft) => {
                                    draft.genres.push(genre);
                                  })
                                );
                              }
                            }}
                          >
                            <Checkbox checked={actionMovie.genres.map((g) => g.genreId).includes(genre.genreId)} />
                            {genre.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                )}
              </ApplicationContext.Consumer>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{
                mr: 1,
                borderRadius: 0,
              }}
              onClick={() => {
                handleUpdate(actionMovie).then(() => {
                  setOpen(false);
                });
              }}
              disabled={equals(movie, actionMovie)}
            >
              {props?.action === 'UPDATE' ? 'Update' : 'Create'}
            </Button>
          </Grid>
        </Paper>
      </Box>
    </Modal>
  );
};

export default EditMovie;
