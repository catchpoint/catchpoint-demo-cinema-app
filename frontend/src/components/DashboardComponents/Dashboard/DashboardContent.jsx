import { Chip, Grid, List, TablePagination, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { loadUser } from '../../../utils/localStorage';
import DashboardCard from './DashboardCard';

import PersonIcon from '@mui/icons-material/Person';
import MovieIcon from '@mui/icons-material/Movie';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DiscountIcon from '@mui/icons-material/Discount';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

import { getMovieCount, getOnshowMovieCount } from '../../../api/movie';
import { getUsers } from '../../../api/user';
import { convertToK } from '../../../utils/object';
import RecentActivities from '../RecentActivities';
import { getTheatres } from '../../../api/theatre';
import { getCoupons } from '../../../api/coupon';
import { getDailyRevenue, getMostSoldMovie, getSoldTicketCount, getTicketCount, getTotalRevenue } from '../../../api/reservation';

const colors = {
  ADMIN: '#4C4C6D',
  USER_MANAGER: '#1B9C85',
  THEATRE_MANAGER: '#F266AB',
  USER: '#00818c',
};

const DashboardContent = () => {
  const [movieCount, setMovieCount] = useState({
    total: 0,
    onshow: 0,
  });
  const [userCount, setUserCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);

  const [theatreCount, setTheatreCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [soldTicketCount, setSoldTicketCount] = useState(0);

  const [mostSoldMovie, setMostSoldMovie] = useState('');
  const [leastSoldMovie, setLeastSoldMovie] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setMovieCount({
        total: await getMovieCount(0),
        onshow: await getOnshowMovieCount(),
      });
      setUserCount((await getUsers()).data.length);
      setTheatreCount((await getTheatres()).length);
      setCouponCount((await getCoupons()).length);
      setRevenue(await getTotalRevenue());
      setDailyRevenue(await getDailyRevenue());
      setSoldTicketCount(await getSoldTicketCount());
      setTicketCount(await getTicketCount());
      setMostSoldMovie(await getMostSoldMovie());
      setLeastSoldMovie(await getMostSoldMovie());
    };

    fetchAll();

    return () => {
      setMovieCount({
        total: 0,
        onshow: 0,
      });
      setUserCount(0);
      setTheatreCount(0);
      setCouponCount(0);
      setRevenue(0);
      setDailyRevenue(0);
      setSoldTicketCount(0);
      setTicketCount(0);
      setMostSoldMovie('');
      setLeastSoldMovie('');
    };

  }, []);

  return (
    <Grid>
      <h2 style={{ color: '#fff' }}>
        <b>Welcome</b>, {loadUser().username}{' '}
        <Chip
          label={loadUser().role.replace('_', ' ')}
          sx={{
            backgroundColor: colors[loadUser().role],
            color: '#fff',
            borderRadius: 0,
            marginLeft: 2,
          }}
        />
      </h2>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={2}>
          <DashboardCard title="Revenue" value={convertToK(revenue) + ' $'} icon={<AttachMoneyIcon />} bg="#005B44" />
        </Grid>
        <Grid item xs={12} md={2}>
          <DashboardCard title="Users" value={convertToK(userCount)} icon={<PersonIcon />} />
        </Grid>
        <Grid item xs={12} md={2}>
          <DashboardCard title="Movies Released" value={convertToK(movieCount.onshow) + ' / ' + convertToK(movieCount.total)} icon={<MovieIcon />} />
        </Grid>

        <Grid item xs={12} md={2}>
          <DashboardCard title="Available Tickets" value={convertToK(ticketCount - soldTicketCount)} icon={<ConfirmationNumberIcon />} />
        </Grid>
        <Grid item xs={12} md={2}>
          <DashboardCard title="Theatres" value={convertToK(theatreCount)} icon={<MeetingRoomIcon />} />
        </Grid>
        <Grid item xs={12} md={2}>
          <DashboardCard title="Coupons" value={convertToK(couponCount)} icon={<DiscountIcon />} />
        </Grid>
        <Grid item xs={12} md={2}>
          <DashboardCard title="Average Daily Sales" value={convertToK(dailyRevenue) + ' $'} icon={<PriceCheckIcon />} />
        </Grid>

        <Grid item xs={12} md={2}>
          <DashboardCard title="Sold Tickets" value={convertToK(soldTicketCount)} icon={<ConfirmationNumberIcon />} />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard title="Most Sold Movie" value={mostSoldMovie} icon={<ConfirmationNumberIcon />} textSize="1rem" />
        </Grid>
        <Grid item xs={12} md={4}>
          <DashboardCard title="Least Sold Movie" value={leastSoldMovie} icon={<ConfirmationNumberIcon />} textSize="1rem" />
        </Grid>
      </Grid>

      <Grid container mt={2}>
        <h2 style={{ color: '#fff' }}>Recent Activities</h2>
        <RecentActivities />
      </Grid>
    </Grid>
  );
};

export default DashboardContent;
