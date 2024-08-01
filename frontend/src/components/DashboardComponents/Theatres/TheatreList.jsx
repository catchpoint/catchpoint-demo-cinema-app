import { Grid, TableContainer, Paper, Table, TableHead, TableRow, TableBody, Button, Chip, Modal } from '@mui/material';
import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

import CustomTableCell from '../CustomTableCell';

import ReportDownload from '../../ReportDownload';
import { createTheatre, deleteTheatre, getTheatres, updateTheatre } from '../../../api/theatre';
import TheatreDialog from './TheatreDialog';
import CustomDialog from '../../CustomDialog/CustomDialog';

const TheatreList = () => {
  const [theatres, setTheatres] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [theatre, setTheatre] = React.useState({
    theatreId: -1,
    name: '',
    available: true,
    seats: [],
  });

  const [create, setCreate] = React.useState(false);

  const [forceUpdate, setForceUpdate] = React.useState(false);

  const toggleForceUpdate = () => {
    setForceUpdate(!forceUpdate);
  };

  const handleClose = async (e, data, isCreate) => {
    if (data) {
      if (isCreate) {
        await createTheatre(data);
      } else {
        await updateTheatre(data);
      }
      toggleForceUpdate();
    }

    setOpen(false);
  };

  React.useEffect(() => {
    const fetchTheatres = async () => {
      const res = await getTheatres();
      setTheatres(res);
    };

    fetchTheatres();

    return () => {
      setTheatres([]);
    };
  }, [forceUpdate]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        <h3 style={{ color: '#fff' }}>Theatres</h3>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          sx={{ textTransform: 'uppercase' }}
          startIcon={<AddIcon />}
          fullWidth
          onClick={() => {
            setCreate(true);
            setOpen(true);
          }}
        >
          Add Theatre
        </Button>
      </Grid>

      <Grid item xs={2}>
        <ReportDownload
          txt={'Download Report'}
          sx={{ width: '100%' }}
          dataHandler={getTheatres()}
          map={(theatre) => {
            return {
              'Theatre ID': theatre.theatreId,
              Name: theatre.name,
              Available: theatre.available ? 'Available' : 'Not Available',
              SeatSize: theatre.seats.length,
            };
          }}
        />
      </Grid>
      <TableContainer component={Paper} sx={{ borderRadius: 2, backgroundColor: '#051d32', marginTop: '10px', maxHeight: window.innerHeight - 150 }}>
        <Table sx={{ minWidth: 700 }} stickyHeader>
          <TableHead>
            <TableRow>
              <CustomTableCell>
                <b>Theatre ID</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Name</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Available</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Action</b>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflow: 'scroll' }}>
            {theatres?.map((theatre) => (
              <TableRow key={theatre.theatreId}>
                <CustomTableCell>{theatre.theatreId}</CustomTableCell>
                <CustomTableCell sx={{ minWidth: '200px' }}>{theatre.name}</CustomTableCell>
                <CustomTableCell>
                  <Chip label={theatre.available ? 'Available' : 'Not Available'} sx={{ backgroundColor: theatre.available ? '#4caf50' : '#f44336', color: '#fff', borderRadius: '5px', width: '200px' }} />
                </CustomTableCell>
                <CustomTableCell>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        sx={{ width: '100%', borderRadius: '0px', textTransform: 'none', color: '#fff', backgroundColor: '#296073' }}
                        onClick={async (e) => {
                          e.preventDefault();
                          await updateTheatre({ ...theatre, available: !theatre.available });
                          toggleForceUpdate();
                        }}
                        startIcon={theatre.available ? <CloseIcon /> : <CheckIcon />}
                      >
                        {theatre.available ? 'Disable' : 'Enable'}
                      </Button>
                    </Grid>

                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%', borderRadius: '0px', textTransform: 'uppercase' }}
                        startIcon={<EditIcon />}
                        onClick={() => {
                          setTheatre(theatre);
                          setCreate(false);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ width: '100%', borderRadius: '0px', textTransform: 'uppercase' }}
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                          setTheatre(theatre);
                          setOpenDialog(true);
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

      {theatre && <TheatreDialog open={open} handleClose={handleClose} theatre={theatre} create={create} />}
      {theatre && (
        <CustomDialog
          open={openDialog}
          handleClose={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.target.ariaLabel === 'yes') {
              await deleteTheatre(theatre.theatreId);
              toggleForceUpdate();
            }

            setOpenDialog(false);
          }}
          type={'yesno'}
          title={'Delete Theatre'}
          content={'Are you sure you want to delete this theatre ' + theatre.name + '?'}
        />
      )}
    </Grid>
  );
};

export default TheatreList;
