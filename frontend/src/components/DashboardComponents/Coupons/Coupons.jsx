import React from 'react';
import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableBody, Button, Chip, Modal, Box, Typography, IconButton, TextField, Select, MenuItem } from '@mui/material';
import CustomTableCell from '../CustomTableCell';
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from '../../../api/coupon';
import dayjs from 'dayjs';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomDialog from '../../CustomDialog/CustomDialog';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ReportDownload from '../../ReportDownload';

const Coupons = () => {
  const [coupons, setCoupons] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [create, setCreate] = React.useState(false);

  const [actionCoupon, setActionCoupon] = React.useState({ code: '', amount: 0, rate: 0, expireDate: '', activateDate: '', valid: true });
  const [forceUpdate, setForceUpdate] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');

  const handleDelete = async (e) => {
    e.preventDefault();

    if (e.target.ariaLabel === 'yes') {
      await deleteCoupon(actionCoupon.code);
      setForceUpdate(!forceUpdate);
    }

    setDialogOpen(false);
  };

  React.useEffect(() => {
    const fetchCoupons = async () => {
      const res = await getCoupons();
      setCoupons(res);
    };

    fetchCoupons();

    return () => {
      setCoupons([]);
    };
  }, [forceUpdate]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <h3 style={{ color: '#fff' }}>Coupons</h3>
      </Grid>
      <Grid item xs={4} sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCreate(true);
            setOpen(true);
          }}
        >
          Create Coupon
        </Button>
        &nbsp;&nbsp;
        <ReportDownload
          txt={'Download Report'}
          dataHandler={getCoupons()}
          map={(coupon) => {
            return {
              'Coupon Code': coupon.code,
              'Coupon Type': coupon.amount != undefined ? 'Amount' : 'Percent',
              Discount: coupon.amount != undefined ? coupon.amount + ' $' : coupon.rate + ' %',
              'Expiry Date': dayjs(coupon.expireDate).format('DD/MM/YYYY'),
              'Active Date': dayjs(coupon.activateDate).format('DD/MM/YYYY'),
              Left: coupon.left,
              Valid: coupon.valid ? 'USABLE' : 'NOT USABLE',
            };
          }}
        />
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2, backgroundColor: '#051d32', marginTop: '10px', maxHeight: window.innerHeight - 150 }}>
        <Table sx={{ minWidth: 700 }} stickyHeader>
          <TableHead>
            <TableRow>
              <CustomTableCell>
                <b>Coupon Code</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Coupon Type</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Discount</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Expiry Date</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Active Date</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Left</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Action</b>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflow: 'scroll' }}>
            {coupons.map((coupon) => (
              <TableRow key={coupon.couponCode}>
                <CustomTableCell>
                  <Chip label={coupon.valid ? 'USABLE' : 'NOT USABLE'} sx={{ backgroundColor: coupon.valid ? '#4caf50' : '#f44336', color: '#fff', borderRadius: '5px', width: '100px', marginRight: '10px' }} />
                  {coupon.code}
                </CustomTableCell>
                <CustomTableCell>{coupon.amount != undefined ? 'Amount' : 'Percent'}</CustomTableCell>
                <CustomTableCell>{coupon.amount != undefined ? coupon.amount + ' $' : coupon.rate + ' %'}</CustomTableCell>
                <CustomTableCell>{dayjs(coupon.expireDate).format('DD.MM.YYYY')}</CustomTableCell>
                <CustomTableCell>{dayjs(coupon.activateDate).format('DD.MM.YYYY')}</CustomTableCell>
                <CustomTableCell>{coupon.couponLeft}</CustomTableCell>
                <CustomTableCell>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setCreate(false);
                          setOpen(true);
                          setActionCoupon(coupon);
                          setCouponCode(coupon.code);
                        }}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setDialogOpen(true);
                          setActionCoupon(coupon);
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomDialog open={dialogOpen} setOpen={setDialogOpen} title={'Create Coupon'} content={'Are you sure you want to create this coupon?'} type={'yesno'} handleClose={handleDelete} />
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -40%)',
          }}
        >
          <Paper sx={{ p: 2, width: '600px', height: 'max-content' }}>
            <Grid
              container
              spacing={2}
              sx={{
                overflow: 'scroll',
                maxHeight: '700px',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  {create ? 'Create Coupon' : 'Update Coupon'}
                </Typography>
                <IconButton onClick={() => setOpen(false)} sx={{ float: 'right' }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12} md={12} spacing={1} container>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Coupon Code"
                    variant="outlined"
                    value={actionCoupon.code}
                    onChange={(e) => {
                      setActionCoupon({ ...actionCoupon, code: e.target.value });
                    }}
                    disabled={!create}
                  />
                </Grid>

                {create && (
                  <Grid item xs={12} md={12}>
                    <Select
                      fullWidth
                      label="Coupon Type"
                      variant="outlined"
                      value={actionCoupon.amount != undefined ? 'Amount' : 'Percent'}
                      onChange={(e) => {
                        if (e.target.value == 'Amount') {
                          setActionCoupon({ ...actionCoupon, amount: 0, rate: undefined });
                        } else {
                          setActionCoupon({ ...actionCoupon, amount: undefined, rate: 0 });
                        }
                      }}
                    >
                      <MenuItem value={'Amount'}>Amount</MenuItem>
                      <MenuItem value={'Percent'}>Percent</MenuItem>
                    </Select>
                  </Grid>
                )}

                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Discount Amount / Rate"
                    variant="outlined"
                    value={actionCoupon.amount != undefined ? actionCoupon.amount : actionCoupon.rate}
                    onChange={(e) => {
                      if (actionCoupon.amount != undefined) {
                        setActionCoupon({ ...actionCoupon, amount: e.target.value, rate: undefined });
                      } else {
                        setActionCoupon({ ...actionCoupon, rate: e.target.value, amount: undefined });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Min Amount / Up to"
                    variant="outlined"
                    value={actionCoupon.minPrice != undefined ? actionCoupon.minPrice : actionCoupon.upTo}
                    onChange={(e) => {
                      if (actionCoupon.minPrice != undefined) {
                        setActionCoupon({ ...actionCoupon, minPrice: e.target.value, upTo: undefined });
                      } else {
                        setActionCoupon({ ...actionCoupon, upTo: e.target.value, minPrice: undefined });
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    variant="outlined"
                    type="date"
                    value={dayjs(actionCoupon.expireDate).format('YYYY-MM-DD')}
                    error={dayjs(actionCoupon.expireDate).isBefore(dayjs().format('YYYY-MM-DD'))}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setActionCoupon({ ...actionCoupon, expireDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Active Date"
                    variant="outlined"
                    type="date"
                    value={dayjs(actionCoupon.activateDate).format('YYYY-MM-DD')}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => setActionCoupon({ ...actionCoupon, activateDate: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    fullWidth
                    label="Coupon Left"
                    variant="outlined"
                    value={actionCoupon.couponLeft}
                    onChange={(e) => {
                      setActionCoupon({ ...actionCoupon, couponLeft: e.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={async (e) => {
                      e.preventDefault();

                      if (create) {
                        await createCoupon(actionCoupon);
                      } else {
                        await updateCoupon(couponCode, actionCoupon);
                      }
                      setOpen(false);
                      setForceUpdate(!forceUpdate);
                    }}
                  >
                    {create ? 'Create' : 'Update'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Coupons;
