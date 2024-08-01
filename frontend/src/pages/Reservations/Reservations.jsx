import React from 'react';
import { deleteReservation, getReservations } from '../../api/reservation';
import ReservationList from '../../components/Reservations';
import Section from '../../components/Section';
import CustomDialog from '../../components/CustomDialog/CustomDialog';
import { Typography } from '@mui/material';

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
      const res = await getReservations({ page, size: RESERVATION_PER_PAGE });
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
    <Section id="movies" height="100vh" sx={{ backgroundColor: '#fff', marginTop: '5rem !important ' }}>
    

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
      />
      <CustomDialog title={'Cancel Reservation'} content={'Are you sure you want to cancel this reservation?'} open={open} setOpen={setOpen} handleClose={handleCancelReservation} type={'yesno'} />
    </Section>
  );
};

export default Reservations;
