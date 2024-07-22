import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

const getDialogContent = (type, handleClose) => {
  switch (type) {
    case "yesno":
      return (
        <>
          <Button onClick={handleClose} autoFocus aria-label="no">
            Disagree
          </Button>
          <Button onClick={handleClose} autoFocus aria-label="yes">
            Agree
          </Button>
        </>
      );
    case "ok":
      return (
        <Button onClick={handleClose} autoFocus aria-label="ok">
          OK
        </Button>
      );
    default:
      break;
  }
};

const CustomDialog = ({ open, title, content, type, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title ? title : "Alert"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content ? content : "Are you sure?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>{getDialogContent(type, handleClose)}</DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
