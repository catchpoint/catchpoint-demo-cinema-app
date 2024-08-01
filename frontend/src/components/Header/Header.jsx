import React, { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Container } from '@mui/system';
import { Button, Divider, Grid, Link, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import './Header.css';
import { useApplication } from '../../context';
import UserHeader from '../UserHeader';
import { red } from '@mui/material/colors';
import { loadUser } from '../../utils/localStorage';
import { loadProfile } from '../../api/user';
import Profile from '../../pages/Profile/Profile';

const Header = () => {
  const [search, setSearch] = React.useState('');

  const context = useApplication();
  const location = useLocation();

  const [profileData, setProfileData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    window.location.href = `/movies${search ? `?query=${search}` : ''}`;
  };

  return (
    <header>
      <Box className={'sticky-header' + (context.isNavTransparent ? ' transparent' : '')}>
        <Container maxWidth="m" sx={{ py: 2 }}>
          <Grid container spacing={4} justifyContent={'space-between'}>
            <Grid item xs={12} sm={12} md={3}>
              <div className="logo">
                <img src="/logo.png" alt="Logo" />
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{
                    color: '#fff',
                    fontWeight: '800',
                    fontFamily: 'Popins, sans-serif',
                  }}
                >
                  <Link href="/" underline="none" color="inherit">
                    SQLCinema
                  </Link>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={context.isAuth ? 8 : 9}>
              <div className="menu">
                <ul>
                  {context.isAuth && loadUser().role.toUpperCase() !== 'USER' ? (
                    <li>
                      <Link
                        className="nav-link"
                        href="/dashboard"
                        sx={{
                          color: '#fff !important',
                          backgroundColor: red[800] + ' !important',
                          padding: '8px',
                          borderRadius: '3px',

                          ['&:hover']: {
                            backgroundColor: red[500] + ' !important',
                            color: '#fff !important',
                          },
                        }}
                      >
                        Dashboard
                      </Link>
                    </li>
                  ) : null}
                  <li>
                    <Link className="nav-link" href="/">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link className="nav-link" href="/movies">
                      Movies
                    </Link>
                  </li>
                  <li>
                    <div className="search-box">
                      <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button
                          type="submit"
                          onClick={handleSubmit}
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
                              borderRadius: '0 50px 50px 0',
                            }}
                          />
                        </Button>
                      </form>
                    </div>
                  </li>
                  <li>
                    <Divider orientation="vertical" flexItem sx={{ borderColor: '#fafafa !important' }} />
                  </li>
                  <li>
                    {context.isAuth ? (
                      <UserHeader logout={context.logout} img={window.profile} />
                    ) : (
                      <Link
                        className="nav-link"
                        href={location.pathname === '/login' ? '/register' : '/login'}
                        sx={{
                          padding: '8px 10px',
                          width: 'max-content',
                          borderRadius: '3px',
                          borderBottom: '2px solid #119eba',
                          transition: 'all 0.3s ease-in-out !important',
                          ['&:hover']: {
                            backgroundColor: '#119eba !important',
                            color: '#fff !important',
                          },
                        }}
                      >
                        {location.pathname === '/login' ? 'Register' : 'Login'}
                      </Link>
                    )}
                  </li>
                </ul>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </header>
  
  );
};

export default memo(Header);
