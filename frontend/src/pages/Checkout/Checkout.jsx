import { Box, Button, Card, Divider, Grid, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useParams } from 'react-router';
import Theatres from './Theatres';
import { getMovie } from '../../api/movie';
import { getTickets, reserveTicket } from '../../api/ticket';
import Seats from './Seats';
import CheckIcon from '@mui/icons-material/Check';

import ApplicationContext from '../../context/context';

const checkPayment = (payment) => {
  return payment != null;
};

const Checkout = () => {
  const { id } = useParams();
  const [tickets, setTickets] = React.useState([]);
  const [movie, setMovie] = React.useState(null);

  const [activeStep, setActiveStep] = React.useState(0);

  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [selectedSeat, setSelectedSeat] = React.useState(null);
  const [paymentInfo, setPaymentInfo] = React.useState({
    cardNumber: '5555555555554444',
    cardName: 'Nguyen Van A',
    expiryDate: '12/25',
    cvv: '123',
    billingAddress: '123 Nguyen Van A',
  });
  const ref = useRef(null);

  React.useEffect(() => {
    const fetchMovie = async () => {
      const tickets = await getTickets(id);
      const movie = await getMovie(id);

      setTickets(tickets);
      setMovie(movie);
    };

    fetchMovie();

    return () => {
      setTickets([]);
      setMovie(null);
    };
  }, [id]);

  const mapStep = () => {
    switch (activeStep) {
      case 0:
        return <Theatres tickets={tickets} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} />;
      case 1:
        return (
          <Grid container spacing={2} width={'100%'} height={'100%'}>
            <Grid item xs={8}>
              <Seats ticketId={selectedTicket} selected={selectedSeat} setSelected={setSelectedSeat} />
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ p: 2, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90%', justifyContent: 'center' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: '400',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#000',
                  }}
                >
                  {selectedSeat ? selectedSeat.length : 0} Seat
                </Typography>
                <br />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: '500',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#000',
                  }}
                >
                  Total{' '}
                  {selectedSeat
                    ? selectedSeat
                        .map((s) => {
                          const price = tickets.find((t) => t.ticketId === selectedTicket).price;
                          if (s.seatType === 'VIP') {
                            return price * 2;
                          } else {
                            return price;
                          }
                        })
                        .reduce((a, b) => a + b, 0)
                    : 0}
                  $
                </Typography>
              </Card>
              <Divider sx={{ my: 2 }} />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Card sx={{ p: 2, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90%', justifyContent: 'center' }}>
            <img src="/credit-card.png" alt="credit-card" style={{ maxHeight: '100px', marginBottom: '1rem' }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="cardNumber"
                  label="Card Number"
                  inputProps={{
                    maxLength: 16,
                  }}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  error={paymentInfo && paymentInfo.cardNumber && !paymentInfo.cardNumber.match(/^[0-9]+$/)}
                  helperText={paymentInfo && paymentInfo.cardNumber && !paymentInfo.cardNumber.match(/^[0-9]+$/) ? 'Card number must be number' : ''}
                  value={paymentInfo?.cardNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth id="cardName" label="Cardholder Name" onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })} value={paymentInfo?.cardName} />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="expiryDate"
                  label="Expiry Date"
                  inputProps={{
                    maxLength: 5,
                  }}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                  value={paymentInfo?.expiryDate}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="cvv"
                  label="CVV"
                  inputProps={{
                    maxLength: 3,
                  }}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  value={paymentInfo?.cvv}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="coupon">Coupon</label>
                <input
                  style={{
                    width: '100%',
                    fontSize: '15px',
                    outline: 'none',
                    padding: '4px',
                  }}
                  ref={ref}
                  id="coupon"
                  label="Coupon"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField required fullWidth id="billingAddress" label="Billing Address" multiline rows={3} onChange={(e) => setPaymentInfo({ ...paymentInfo, billingAddress: e.target.value })} value={paymentInfo?.billingAddress} />
              </Grid>
            </Grid>
          </Card>
        );
      case 3:
        return (
          <Grid container spacing={2} width={'100%'}>
            <Grid item xs={12} textAlign={'center'}>
              <img src="/success.png" alt="success" style={{ maxHeight: '300px', marginBottom: '1rem' }} />
            </Grid>
            <Grid item xs={12} textAlign={'center'}>
              <CheckIcon sx={{ fontSize: '5rem', color: '#4caf50' }} />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: '400',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000',
                }}
              >
                Payment Success
              </Typography>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Grid
      container
      height="100vh"
      p={0}
      m={0}
      sx={{
        overflow: 'auto',
      }}
    >
      <Grid item xs={12} width="100%" p={4} bgcolor={'#00111f'}>
        <Card sx={{ p: 2, backgroundColor: '#fff', mt: 10, maxHeight: '100%' }}>
          <h1> Checkout </h1>

          <Box sx={{ width: '50%', margin: 'auto' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step key={0}>
                <StepLabel>Select Ticket</StepLabel>
              </Step>
              <Step key={1}>
                <StepLabel>Select Seat</StepLabel>
              </Step>
              <Step key={2}>
                <StepLabel>Review & Pay</StepLabel>
              </Step>
              <Step key={3}>
                <StepLabel>Finish</StepLabel>
              </Step>
            </Stepper>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              {movie && (
                <Box sx={{ p: 2, backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100%' }}>
                  <h2> {movie.title} </h2>
                  <br />
                  <img src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 'no-image.jpg'} alt={movie.title} loading="lazy" style={{ maxHeight: '600px' }} />
                </Box>
              )}
            </Grid>

            <Grid item xs={9} mt={2}>
              {mapStep()}
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />

          <Grid item xs={12} display={'flex'} flexDirection={'row-reverse'} gap={2}>
            {activeStep < 3 && (
              <ApplicationContext.Consumer>
                {({ showSnackBar }) => (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={(activeStep === 2 && !checkPayment(paymentInfo)) || (activeStep === 1 && !selectedSeat) || (activeStep === 0 && !selectedTicket)}
                    onClick={async () => {
                      if (activeStep === 2) {
                        const response = await reserveTicket(selectedTicket, selectedSeat, {
                          ...paymentInfo,
                          couponCode: ref.current.value,
                        });

                        if (response.status === 200) {
                          showSnackBar('Payment success', 'success');
                          setActiveStep((prev) => prev + 1);
                        } else {
                          showSnackBar(response.data, 'error');
                        }
                      } else {
                        setActiveStep((prev) => prev + 1);
                      }
                    }}
                  >
                    {activeStep === 2 ? 'Pay' : 'Next'}
                  </Button>
                )}
              </ApplicationContext.Consumer>
            )}
            {activeStep > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (activeStep === 3) {
                    window.location.href = '/reservations';
                    return;
                  }

                  if (activeStep === 2) {
                    setPaymentInfo(null);
                  } else if (activeStep === 1) {
                    setSelectedSeat(null);
                  }
                  setActiveStep((prev) => prev - 1);
                }}
              >
                {activeStep === 3 ? 'Finish' : 'Back'}
              </Button>
            )}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Checkout;
