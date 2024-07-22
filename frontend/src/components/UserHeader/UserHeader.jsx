import { Avatar, Grid, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react';

import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ShopIcon from '@mui/icons-material/Shop';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Profile from '../../pages/Profile/Profile';

const styles = {
  iconButton: {
    color: '#fafafa',
    transition: 'all 0.4s ease',
    ['&:hover']: { color: '#119eba' },
  },

  menuItem: {
    color: '#fafafa',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    transition: 'all 0.4s ease',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    ['&:hover']: { color: '#119eba' },
  },
};

const UserHeader = ({ logout, img }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [openProfile, setOpenProfile] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleUserProfile = () => {
    setOpenProfile(true);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12} md={3}>
          <Tooltip title="Your Favorite Movies" placement="bottom" arrow>
            <IconButton sx={styles.iconButton} href='/favorites'>
              <LocalActivityIcon
                sx={{
                  fontSize: 'xx-large',
                }}
              />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={3}>
          <Tooltip title="Your Reservations" placement="bottom" arrow>
            <IconButton sx={styles.iconButton} href='/reservations'>
              <ShopIcon
                sx={{
                  fontSize: 'xx-large',
                }}
              />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12} md={5} flexGrow={1} display="flex" alignItems="center" justifyContent="center">
          <IconButton
            id="profile"
            onClick={handleClick}
            sx={{
              width: '32px',
              height: '32px',
            }}
          >
            <Avatar alt="User" src={`/avatar.jpg`} p={1}></Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                width: 'max-content',
                overflow: 'visible',
                backgroundColor: 'rgba(44, 48, 53, 0.8)',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem sx={styles.menuItem} onClick={handleUserProfile}>
              My account
            </MenuItem>

            <MenuItem sx={styles.menuItem} onClick={handleLogout}>
              Logout
              <LogoutIcon sx={{ ml: 1 }} />
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      
      <Profile open={openProfile} handleClose={() => setOpenProfile(false)} />
    </>
  );
};

export default UserHeader;
