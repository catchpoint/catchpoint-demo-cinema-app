import React, { useEffect } from 'react';

import { Grid } from '@mui/material';

import Sidebar from '../../components/Sidebar';
import { Coupons, DashboardContent, MovieList, Reservations, SqlLogs, TheatreList, UserList } from '../../components/DashboardComponents';

const Navigate = (page) => {
  switch (page) {
    case 'Dashboard':
      return <DashboardContent />;
    case 'Users':
      return <UserList />;
    case 'SQL Queries':
      return <SqlLogs />;
    case 'Movies':
      return <MovieList />;

    case 'Theatres':
      return <TheatreList />;
    case 'Reservations':
      return <Reservations />;
    case 'Coupons':
      return <Coupons />;
    default:
      break;
  }
};

const Dashboard = () => {
  const [page, setPage] = React.useState('Dashboard');

  return (
    <Grid container height="100vh" p={0} m={0}>
      <Sidebar item xs={2} height="100%" page={page} setPage={setPage} />

      <Grid item xs={10} height="100%" width="100%" p={4} bgcolor={'#00111f'}>
        {Navigate(page)}
      </Grid>
    </Grid>
  );
};

export default Dashboard;
