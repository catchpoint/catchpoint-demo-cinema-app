import React from 'react';
import { produce } from 'immer';

import { Modal, Box, Paper, Grid, Typography, IconButton, TextField, Select, MenuItem, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const produceTheatre = (setTheatre, fn) => {
  setTheatre(
    produce((draft) => {
      fn(draft);
    })
  );
};

const TheatreDialog = ({ theatre, open, handleClose, create }) => {
  const [actionTheatre, setActionTheatre] = React.useState({
    theatreId: -1,
    name: '',
    available: true,
    seats: [],
  });

  React.useEffect(() => {
    if (!create) {
      setActionTheatre(theatre);
    }

    return () => {
      setActionTheatre({
        theatreId: -1,
        name: '',
        available: true,
        seats: [],
      });
    };
  }, [theatre, open]);

  return (
    <Modal open={open} onClose={handleClose}>
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
                {create ? 'Create Theatre' : 'Update Theatre'}
              </Typography>
              <IconButton onClick={handleClose} sx={{ float: 'right' }}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} md={12} spacing={1} container>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={actionTheatre.name}
                  onChange={(e) => {
                    produceTheatre(setActionTheatre, (draft) => {
                      draft.name = e.target.value;
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Select
                  fullWidth
                  label="Available"
                  variant="outlined"
                  value={actionTheatre.available}
                  onChange={(e) => {
                    produceTheatre(setActionTheatre, (draft) => {
                      draft.available = e.target.value;
                    });
                  }}
                >
                  <MenuItem value={true}>Available</MenuItem>
                  <MenuItem value={false}>Not Available</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={() => {
                    handleClose(null, actionTheatre, create);
                  }}
                >
                  {create ? 'Create' : 'Update'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Modal>
  );
};

export default TheatreDialog;
