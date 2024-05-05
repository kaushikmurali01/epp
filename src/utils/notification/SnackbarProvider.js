import React, { createContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const SnackbarContext = createContext();

export const SnackbarProvider = ({
  children,
  defaultType = 'info',
  defaultPosition = { vertical: 'bottom', horizontal: 'right' },
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState(defaultType);
  const [position, setPosition] = useState(defaultPosition);

  const showSnackbar = (msg, type = defaultType, position = defaultPosition) => {
    setMessage(msg);
    setType(type);
    setPosition(position);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={position}
        open={open}
        autoHideDuration= {5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};