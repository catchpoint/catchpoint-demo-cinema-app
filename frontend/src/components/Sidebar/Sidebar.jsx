import React from 'react';

import { Grid, Toolbar, List, ListItem, ListItemIcon, ListItemText, Typography, Link, Icon, ListItemButton, IconButton, Button } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';
import UndoIcon from '@mui/icons-material/Undo';

import items from './items';
import { loadUser } from '../../utils/localStorage';
import ApplicationContext from '../../context';

const Sidebar = ({ page, setPage, ...props }) => {
  return (
    <Grid {...props}>
      <Toolbar
        display="flex"
        sx={{
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#051d32',
          color: '#fff',
        }}
      >
        <Grid
          item
          display={'flex'}
          alignItems={'center'}
          p={2}
          mb={4}
          mt={2}
          sx={{
            flexWrap: 'wrap',
          }}
        >
          <img src="/logo.png" alt="Logo" width="40" />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              color: '#fff',
              fontWeight: '800',
              fontFamily: 'Popins, sans-serif',
            }}
          >
            {' '}
            SQLCinema
          </Typography>
        </Grid>
        <List sx={{ width: '80%', flexGrow: 1 }} display={'flex'} flexdirection={'column'}>
          {items
            .filter((item) => item.roles.includes(loadUser().role))
            .map((item) => (
              <ListItemButton
                key={item.title}
                sx={{
                  width: '100%',
                  gap: '1rem',
                  mb: '8px',

                  ...(page === item.title && {
                    backgroundColor: '#fff',
                    color: '#051d32',
                  }),

                  '&:hover': {
                    backgroundColor: '#fff',
                    color: '#051d32',
                  },
                }}
                onClick={() => setPage(item.title)}
              >
                <item.icon />
                <ListItemText
                  primary={
                    <Typography variant="h6" fontSize={'1.2rem'} fontWeight={'400'} textOverflow={'ellipsis'} overflow={'hidden'}>
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            ))}
        </List>

        <Grid item display={'flex'} justifyContent={'space-between'} p={2} flexDirection={'column'} gap={'1rem'}>
          <Button
            variant="contained"
            sx={{
              color: '#fff',
              display: 'flex',
              gap: '1rem',
              padding: '0.5rem 1rem',
              justifyContent: 'center',
            }}
            href="/"
          >
            <UndoIcon />
            Back to Home
          </Button>

          <ApplicationContext.Consumer>
            {({ logout }) => (
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.5rem 1rem',
                }}
                onClick={() => {
                  logout().then(() => {
                    window.location.href = '/';
                  });
                }}
              >
                <LogoutIcon />
                Logout
              </Button>
            )}
          </ApplicationContext.Consumer>
        </Grid>
      </Toolbar>
    </Grid>
  );
};

export default Sidebar;
