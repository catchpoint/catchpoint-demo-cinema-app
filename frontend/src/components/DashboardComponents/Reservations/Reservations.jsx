import React from 'react';
import ReservationList from '../../Reservations';
import CustomDialog from '../../CustomDialog/CustomDialog';
import { deleteReservation, getAllReservations } from '../../../api/reservation';
import { Button, Grid } from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import ReportDownload from '../../ReportDownload';
import dayjs from 'dayjs';

const RESERVATION_PER_PAGE = 20;

const Reservations = () => {
  const [page, setPage] = React.useState(1);
  const [count, setCount] = React.useState(0);
  const [reservations, setReservations] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [reservationId, setReservationId] = React.useState(null);
  const [forceUpdate, setForceUpdate] = React.useState(false);

  const handleCancelReservation = async (e) => {
    e.preventDefault();

    if (e.target.ariaLabel === 'yes') {
      await deleteReservation(reservationId);
      setForceUpdate(!forceUpdate);
    }

    setOpen(false);
  };

  React.useEffect(() => {
    const fetchReservations = async () => {
      const res = await getAllReservations({ page, size: RESERVATION_PER_PAGE });
      setReservations(res.content);
      console.log(res.content);
      setCount(res.count);
    };

    fetchReservations();

    return () => {
      setReservations([]);
      setCount(0);
    };
  }, [page, forceUpdate]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={10} mr={0}>
              <h3 style={{ color: '#fff' }}>Reservations</h3>
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <ReportDownload
                txt={'Download Report'}
                dataHandler={getAllReservations({ page, size: RESERVATION_PER_PAGE }).then((res) => res.content)}
                map={(reservation) => {
                  return {
                    reservationId: reservation.reservationId,
                    ticketId: reservation.ticketId,
                    username: reservation.username,
                    movieTitle: reservation.movieTitle,
                    theatreName: reservation.theatreName,
                    seatCodes: reservation.seatCodes.join(', '),
                    price: reservation.price + ' $',
                    showTime: dayjs(reservation.showTime).format('DD.MM.YYYY HH:mm'),
                    paymentType: reservation.paymentType,
                  };
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <ReservationList
            reservations={reservations}
            page={page}
            setPage={setPage}
            total={RESERVATION_PER_PAGE}
            count={count}
            handleCancelReservation={(id) => {
              setOpen(true);
              setReservationId(id);
            }}
            mt={'0'}
          />
        </Grid>
      </Grid>
      <CustomDialog title={'Cancel Reservation'} content={'Are you sure you want to cancel this reservation?'} open={open} setOpen={setOpen} handleClose={handleCancelReservation} type={'yesno'} />
    </>
  );
};

export default Reservations;
