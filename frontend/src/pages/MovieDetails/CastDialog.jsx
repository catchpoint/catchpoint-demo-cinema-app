import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

const CastDialog = ({ open, handleClose, title, sx, children }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={sx}>
      <DialogTitle id="alert-dialog-title">
        <>{title ? title : 'Alert'}</>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus aria-label="no" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CastDialog;
