import { Modal } from "@mui/material";
import React from "react";

const TrailerModal = ({ trailUrl, open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
      }}

      onClick={handleClose}

    >
      <iframe
        src={trailUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
            position: "absolute",
            width: "800px",
            height: "500px",
        }}
      ></iframe>
    </Modal>
  );
};

export default TrailerModal;
