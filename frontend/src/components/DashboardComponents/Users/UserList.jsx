import { Table, TableContainer, Paper, TableHead, TableRow, TableBody, Button, Chip, Modal, Box, TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import React from 'react';
import produce from 'immer';

import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { loadUser } from '../../../utils/localStorage';

import CustomTableCell from '../CustomTableCell';
import CloseIcon from '@mui/icons-material/Close';
import { equals } from '../../../utils/object';
import { deleteUser, getUsers, updateUser } from '../../../api/user';
import CustomDialog from '../../CustomDialog/CustomDialog';

import dayjs from 'dayjs';
import ReportDownload from '../../ReportDownload';

const colors = {
  ADMIN: '#4C4C6D',
  USER_MANAGER: '#1B9C85',
  THEATRE_MANAGER: '#F266AB',
  USER: '#00818c',
};

const UserList = () => {
  const [users, setUsers] = React.useState([]);
  const [actionUser, setActionUser] = React.useState({});
  const [open, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [forceUpdate, setForceUpdate] = React.useState(false);
  const toggleForceUpdate = () => setForceUpdate((forceUpdate) => !forceUpdate);

  const handleOpenEdit = (user) => {
    setActionUser(user);
    setOpenEdit(true);
  };

  const handleOpenDelete = (user) => {
    setActionUser(user);
    setOpenDelete(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleEditUser = () => {
    updateUser(actionUser.userId, actionUser).then((res) => {
      if (res.status === 200) {
        setActionUser({});
        handleCloseEdit();
        toggleForceUpdate();
      }
    });
  };

  const handleDeleteUser = () => {
    deleteUser(actionUser.userId).then((res) => {
      if (res.status === 200) {
        setActionUser({});
        toggleForceUpdate();
      }

      handleCloseDelete();
    });
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      setUsers(res.data);
    };
    fetchUsers();
  }, [forceUpdate]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={10}>
          <h3 style={{ color: '#fff' }}>User List</h3>
        </Grid>
        <Grid item xs={12} md={2}>
          <ReportDownload
            dataHandler={getUsers().then((res) => res.data)}
            sx={{
              marginBottom: '10px',
              position: 'relative',
              width: '100%',
            }}
            map={(user) => {
              return {
                'Full Name': user.fullName,
                Username: user.username,
                Email: user.email,
                'Phone Number': user.phoneNumber,
                'Birth Date': user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A',
                'User Type': user.role.replace('_', ' '),
              };
            }}
            txt="Download User List"
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 2, backgroundColor: '#051d32', maxHeight: '90%' }}>
        <Table sx={{ minWidth: 700 }} stickyHeader>
          <TableHead>
            <TableRow>
              <CustomTableCell>
                <b>Full Name</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Username</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Email</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Phone Number</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Birth Date</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>User Type</b>
              </CustomTableCell>
              <CustomTableCell>
                <b>Actions</b>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflow: 'scroll' }}>
            {users?.map((user) => (
              <TableRow key={user.userId} sx={{ border: 'none' }} hover={true}>
                <CustomTableCell component="th" scope="row">
                  <span>{user.fullName || 'N/A'}</span>
                </CustomTableCell>
                <CustomTableCell>{user.username}</CustomTableCell>
                <CustomTableCell>{user.email}</CustomTableCell>
                <CustomTableCell>{user.phoneNumber || 'N/A'}</CustomTableCell>
                <CustomTableCell>{user.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'N/A'}</CustomTableCell>
                <CustomTableCell sx={{ maxWidth: '200px' }}>
                  <Chip
                    label={user.role.replace('_', ' ')}
                    sx={{
                      backgroundColor: colors[user.role],
                      color: '#fff',
                      borderRadius: 0,
                      width: '100%',
                    }}
                  />
                </CustomTableCell>
                {(loadUser() && loadUser().role === 'ADMIN') || loadUser().role === 'USER_MANAGER' ? (
                  <CustomTableCell sx={{ minWidth: 300 }}>
                    <Grid container spacing={1} flexDirection="row">
                      <Grid item>
                        <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => handleOpenEdit(user)}>
                          Edit
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} onClick={() => handleOpenDelete(user)}>
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </CustomTableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={handleCloseEdit}>
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Paper sx={{ p: 2, width: '600px', height: 'max-content' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  Edit User
                </Typography>
                <IconButton onClick={handleCloseEdit} sx={{ float: 'right' }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={actionUser.fullName || ''}
                  onChange={(e) => {
                    setActionUser(
                      produce(actionUser, (draft) => {
                        draft.fullName = e.target.value;
                      })
                    );
                  }}
                />
              </Grid>
              {actionUser.userId === loadUser().userId ? null : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={actionUser.username}
                    onChange={(e) => {
                      setActionUser(
                        produce(actionUser, (draft) => {
                          draft.username = e.target.value;
                        })
                      );
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={actionUser.phoneNumber || ''}
                  onChange={(e) => {
                    setActionUser(
                      produce(actionUser, (draft) => {
                        draft.phoneNumber = e.target.value;
                      })
                    );
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  variant="outlined"
                  type="date"
                  value={dayjs(actionUser.birthDate).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    setActionUser(
                      produce(actionUser, (draft) => {
                        draft.birthDate = e.target.value;
                      })
                    );
                  }}
                  error={dayjs(actionUser.birthDate).isAfter(dayjs().format('YYYY-MM-DD'))}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    value={actionUser.role}
                    label="Role"
                    onChange={(e) => {
                      setActionUser(
                        produce(actionUser, (draft) => {
                          draft.role = e.target.value;
                        })
                      );
                    }}
                    inputProps={{
                      style: {
                        width: '100px !important',
                      },
                    }}
                  >
                    <MenuItem value="USER">User</MenuItem>
                    <MenuItem value="USER_MANAGER">User Manager</MenuItem>
                    <MenuItem value="THEATRE_MANAGER">Theatre Manager</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  sx={{
                    mr: 1,
                    borderRadius: 0,
                  }}
                  onClick={() => {
                    handleEditUser();
                  }}
                  disabled={
                    (Object.keys(actionUser).length > 0 &&
                      equals(
                        actionUser,
                        users.find((user) => user.userId === actionUser.userId)
                      )) ||
                    actionUser.birthDate > dayjs().format('YYYY-MM-DD')
                  }
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Modal>
      <CustomDialog
        open={openDelete}
        onClose={handleCloseDelete}
        title="Delete User"
        content={`Are you sure you want to delete ${actionUser.fullName || actionUser.username}?`}
        type={'yesno'}
        handleClose={(e) => {
          if (e.target.ariaLabel === 'yes') {
            handleDeleteUser();
          } else {
            handleCloseDelete();
          }
        }}
      />
    </>
  );
};

export default UserList;
