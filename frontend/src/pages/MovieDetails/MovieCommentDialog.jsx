import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

const MovieCommentDialog = ({open, handleClose, title, sx, children }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" sx={sx} >
      <DialogTitle id="alert-dialog-title">{title ? title : 'Alert'}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus aria-label="no" variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleClose} autoFocus aria-label="yes" color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieCommentDialog;
