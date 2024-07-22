import React from 'react';

import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Pagination, PaginationItem, Box } from '@mui/material';
import CustomTableCell from '../DashboardComponents/CustomTableCell';
import dayjs from 'dayjs';
import { downloadReservation } from '../../utils/report';
import { getReservation } from '../../api/reservation';

const ReservationList = ({ reservations, count, page, setPage, total, handleCancelReservation, mt }) => {
  return (
    <Grid container height={'100%'} p={0} m={0}>
      <Grid item xs={12} height="100%" width="100%" p={4} bgcolor={'#00111f'}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, backgroundColor: '#051d32', maxHeight: '90%', marginTop: mt || '4%' }}>
          <Table sx={{ minWidth: 700 }} stickyHeader>
            <TableHead>
              <TableRow>
                <CustomTableCell width="5%">
                  <b>Reservation Id</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Ticket Id</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Username</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Movie</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Theatre</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Seats</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Price</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Time</b>
                </CustomTableCell>
                <CustomTableCell width="5%">
                  <b>Payment Type</b>
                </CustomTableCell>
                <CustomTableCell>
                  <b>Actions</b>
                </CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ overflow: 'scroll' }}>
              {reservations.map((reservation) => (
                <TableRow key={reservation.reservationId}>
                  <CustomTableCell>{reservation.reservationId}</CustomTableCell>
                  <CustomTableCell>{reservation.ticketId}</CustomTableCell>
                  <CustomTableCell>{reservation.username}</CustomTableCell>
                  <CustomTableCell>{reservation.movieTitle}</CustomTableCell>
                  <CustomTableCell>{reservation.theatreName}</CustomTableCell>
                  <CustomTableCell sx={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reservation.seatCodes.join(', ')}</CustomTableCell>
                  <CustomTableCell>{reservation.price} $</CustomTableCell>
                  <CustomTableCell>{dayjs(reservation.showTime).format('DD.MM.YYYY HH:mm')}</CustomTableCell>
                  <CustomTableCell>{reservation.paymentType}</CustomTableCell>
                  <CustomTableCell>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => {
                            getReservation(reservation.reservationId).then((res) => {
                              downloadReservation(res);
                            });
                          }}
                        >
                          Download
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="contained" color="error" fullWidth onClick={() => handleCancelReservation(reservation.reservationId)}>
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          color="primary"
          count={Math.ceil(count / total)}
          page={page}
          onChange={(e, value) => setPage(value)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
          }}
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                color: '#fff',
                backgroundColor: '#051d32',
                '&:hover': {
                  backgroundColor: '#051d32',
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default ReservationList;
