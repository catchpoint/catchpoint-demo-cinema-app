import React, { useEffect, useLayoutEffect } from 'react';

import { Box, Button, Card, Divider, Grid, IconButton, Modal, Paper, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import { deleteUser, getUser, loadProfile, updateUser, updateUserPassword, uploadProfileImage } from '../../api/user';
import dayjs from 'dayjs';
import { equals } from '../../utils/object';
import CustomDialog from '../../components/CustomDialog/CustomDialog';
import { clearApplicationData } from '../../utils/localStorage';
import { useApplication } from '../../context';

const Profile = ({ open, handleClose }) => {
  const [initialUser, setInitialUser] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [profileData, setProfileData] = React.useState(null);

  const [newProfileImage, setNewProfileImage] = React.useState(null);

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const [forceUpdate, setForceUpdate] = React.useState(false);

  const context = useApplication();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (e.target.ariaLabel === 'yes') {
      await deleteUser(user.userId);
      clearApplicationData();
      window.location.href = '/';
    }

    setDeleteOpen(false);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      return;
    }

    const response = await updateUserPassword({
      oldPassword,
      newPassword,
    });

    if (response.status === 200) {
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      context.showSnackBar('Password changed successfully', 'success');
    } else {
      context.showSnackBar('Password change failed', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (newProfileImage) {
      await uploadProfileImage(newProfileImage);

      setNewProfileImage(null);
    }

    const response = await updateUser(user.userId, {
      ...user,
    });

    if (response.status === 200) {
      setInitialUser(user);

      context.showSnackBar('Profile updated successfully', 'success');
    } else {
      context.showSnackBar('Profile update failed', 'error');
    }

    setForceUpdate(!forceUpdate);
  };

  useLayoutEffect(() => {
    const fetchUser = async () => {
      const response = await getUser();
      setUser(response.data);

      if (!initialUser) {
        setInitialUser(response.data);
      }

      const profile = await loadProfile();
      setProfileData(profile);
    };

    fetchUser();

    return () => {
      setUser(null);
      setInitialUser(null);
      setProfileData(null);
    };
  }, []);

  useEffect(() => {
    if (newProfileImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(e.target.result);
      };
      reader.readAsDataURL(newProfileImage);
    }
  }, [newProfileImage]);

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -40%)',
          }}
        >
          <Grid container sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }} padding={0}>
            <Grid item xs={12} width={'100%'}>
              <Card sx={{ p: 2, backgroundColor: '#fff' }}>
                <Grid display={'flex'} alignItems={'center'} justifyContent={'space-between'} mb={2} flex-direction={'row'}>
                  <Typography variant="h4">Profile</Typography>
                  <Grid>
                    <Button variant="outlined" color="error" sx={{ mt: 2 }} onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mt: 2, ml: 1 }} onClick={handleSaveProfile} startIcon={<SaveIcon />} disabled={equals(initialUser, user) && !newProfileImage}>
                      Save
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Card sx={{ p: 2, backgroundColor: '#fff' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <img src={profileData} alt="avatar" style={{ maxHeight: '300px', maxWidth: '100%' }} display="block" />
                      <Typography variant="h6" m={2} ml={0} textAlign={'center'}>
                        {initialUser?.fullName}
                      </Typography>
                      <Button variant="contained" color="primary" fullWidth component="label" sx={{ mt: 2 }}>
                        Upload Picture
                        <input type="file" hidden onChange={(e) => setNewProfileImage(e.target.files[0])} />
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8}>
                      <TextField fullWidth label="Full Name" variant="outlined" value={user?.fullName} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
                      <TextField fullWidth label="Username" variant="outlined" value={user?.username} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={(e) => setUser({ ...user, username: e.target.value })} />
                      <TextField fullWidth label="Phone Number" variant="outlined" value={user?.phoneNumber} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} />
                      <TextField
                        fullWidth
                        label="Birth Date"
                        variant="outlined"
                        type="date"
                        value={dayjs(user?.birthDate).format('YYYY-MM-DD')}
                        error={dayjs(user?.birthDate).isAfter(dayjs().format('YYYY-MM-DD'))}
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Card>

                <Divider sx={{ my: 2 }} />

                <Card sx={{ p: 2, backgroundColor: '#fff' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="h6">Change Password</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8}>
                      <TextField fullWidth label="Old Password" variant="outlined" sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} onChange={(e) => setOldPassword(e.target.value)} type="password" value={oldPassword} />
                      <TextField
                        fullWidth
                        label="New Password"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={newPassword !== confirmNewPassword}
                        type="password"
                        value={newPassword}
                      />
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        error={newPassword !== confirmNewPassword}
                        value={confirmNewPassword}
                        type="password"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}></Grid>
                    <Grid item xs={12} sm={6} md={8}>
                      <Button variant="contained" color="primary" onClick={handleSavePassword} fullWidth disabled={newPassword !== confirmNewPassword || oldPassword.length < 1 || newPassword.length < 1 || confirmNewPassword.length < 1}>
                        Change Password
                      </Button>
                      <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={() => setDeleteOpen(true)} fullWidth>
                        Delete Account
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Card>
            </Grid>
          </Grid>

          <CustomDialog open={deleteOpen} handleClose={handleDeleteAccount} title="Delete Account" content="Are you sure you want to delete your account?" type="yesno" />
        </Box>
      </Modal>
    </>
  );
};

export default Profile;
