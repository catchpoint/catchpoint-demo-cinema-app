import { Box, Button, Grid, IconButton, Modal, Paper, Select, Typography } from '@mui/material';
import React from 'react';
import { arrayToHtmlTable, arrayToPdfTable, arrayToXmlTable, downloadFile } from '../../utils/report';

import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const ReportDownload = ({ dataHandler, map, sx, txt }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const data = await dataHandler;
        setData(data.map(map));
      };
      fetchData();
    }

    return () => {
      setData([]);
    };
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = (e) => {
    e.preventDefault();

    if (e.currentTarget.getAttribute('aria-label') === 'download-as-html') {
      downloadFile('report.html', arrayToHtmlTable(data));
    } else if (e.currentTarget.getAttribute('aria-label') === 'download-as-xml') {
      downloadFile('report.xml', arrayToXmlTable(data));
    } else if (e.currentTarget.getAttribute('aria-label') === 'download-as-pdf') {
      downloadFile('report.pdf', arrayToPdfTable(data));
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} sx={sx} variant="contained" color="success">
        <DownloadIcon /> {txt && txt}
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -40%)',
          }}
        >
          <Paper sx={{ p: 2, width: '600px', height: 'max-content' }}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Download Report
              </Typography>
              <IconButton onClick={handleClose} sx={{ float: 'right' }}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} spacing={1} container>
                <Grid item xs={12} md={12}>
                  <Button variant="contained" fullWidth onClick={handleDownload} aria-label="download-as-html">
                    Download as HTML
                  </Button>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button variant="contained" fullWidth onClick={handleDownload} aria-label="download-as-xml">
                    Download as XML
                  </Button>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button variant="contained" fullWidth onClick={handleDownload} aria-label="download-as-pdf">
                    Download as PDF
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Modal>
    </>
  );
};

export default ReportDownload;
