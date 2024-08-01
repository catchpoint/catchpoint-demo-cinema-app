import { Box, Chip, Grid, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import React from 'react';
import { getSeats } from '../../api/ticket';
import { convert2DArray } from '../../utils/object';

const mapSeatToColor = (seat, selected) => {
  if (selected && selected.some((s) => s.seatCode === seat.seatCode)) {
    return '#2196f3';
  } else if (seat.available) {
    if (seat.seatType === 'VIP') {
      return '#ff9800';
    } else {
      return '#4caf50';
    }
  } else {
    return '#f44336';
  }
};

const Seats = ({ ticketId, selected, setSelected }) => {
  const [seats, setSeats] = React.useState([]);

  React.useEffect(() => {
    const fetchSeats = async () => {
      const res = await getSeats(ticketId);
      setSeats(res);
    };

    fetchSeats();

    return () => {
      setSeats([]);
    };
  }, [ticketId]);

  return (
    <Paper elevation={3} sx={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '90%' }}>
      <Box width={'70%'} height={'32px'} sx={{ backgroundColor: '#000', textAlign: 'center' }}>
        <Typography
          sx={{
            fontWeight: '600',
            fontFamily: 'Poppins, sans-serif',
            color: '#fff',
          }}
        >
          SCREEN
        </Typography>
      </Box>
      <List sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', maxWidth: '800px', maxHeight: '800px' }}>
        <Grid container spacing={2}>
          {seats.map((seat) => (
            <Grid item xs={2} key={seat.seatCode}>
              <ListItem disablePadding>
                <Chip
                  disabled={!seat.available}
                  label={seat.seatCode}
                  sx={{ width: '100px', borderRadius: 0, bgcolor: mapSeatToColor(seat, selected), color: '#fff', ['&:hover']: { backgroundColor: '#2196f3' } }}
                  onClick={() => {
                    if (seat.available) {

                      selected = selected || [];

                      if (selected.some((s) => s.seatCode === seat.seatCode)) {
                        setSelected(selected.filter((s) => s.seatCode !== seat.seatCode));
                      } else {
                        setSelected([...selected, seat]);
                      }
                    }
                  }}
                />
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
      <br />

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Chip label="Available" sx={{ mr: '1rem', bgcolor: '#4caf50', color: '#fff' }} />
        <Chip label="Selected" sx={{ mr: '1rem', bgcolor: '#2196f3', color: '#fff' }} />
        <Chip label="VIP" sx={{ mr: '1rem', bgcolor: '#ff9800', color: '#fff' }} />
        <Chip label="Reserved" sx={{ bgcolor: '#f44336', color: '#fff' }} />
      </Box>
    </Paper>
  );
};

export default Seats;
