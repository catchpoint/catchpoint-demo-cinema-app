import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Radio, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

const Theatres = ({ tickets, selectedTicket, setSelectedTicket }) => {
  const [selectedTheatre, setSelectedTheatre] = React.useState(null);

  const theatres = new Map();

  tickets.forEach((ticket) => {
    if (!theatres.has(ticket.theatreId)) {
      theatres.set(ticket.theatreId, [ticket]);
    } else {
      theatres.get(ticket.theatreId).push(ticket);
    }
  });

  return (
    <Grid container spacing={2}>
      {[...theatres.keys()].map((id) => (
        <Grid item xs={12} sm={6} md={4} key={id}>
          <Accordion
            disabled={!theatres.get(id)[0].theatre.available}
            expanded={selectedTheatre == id || theatres.get(id).some((t) => t.ticketId === selectedTicket)}
            onChange={() => {
              if (selectedTheatre == id) {
                setSelectedTheatre(null);
              } else {
                setSelectedTheatre(id);
              }
            }}
          >
            <AccordionSummary>
              <Typography
                sx={{
                  fontWeight: '600',
                  fontFamily: 'Poppins, sans-serif',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  color: '#000',
                }}
              >
                {theatres.get(id)[0].theatre.name}
              </Typography>

              <Typography
                sx={{
                  fontWeight: '400',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000',
                  ml: 'auto',
                }}
              >
                {theatres.get(id).length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {theatres.get(id).map((ticket) => (
                  <ListItem
                    key={ticket.ticketId}
                    secondaryAction={
                      <Radio
                        checked={selectedTicket === ticket.ticketId}
                        onChange={() => {
                          setSelectedTicket(ticket.ticketId);
                        }}
                        value={ticket.ticketId}
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': ticket.ticketId }}
                      />
                    }
                  >
                    <ListItemText primary={dayjs(ticket.showTime).format('DD.MM.YYYY')} secondary={dayjs(ticket.showTime).format('HH:mm')} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};

export default Theatres;
