import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function EvModal(props) {

  const {
    modalVisible,
    modalBodyContent,
    buttonsUI,
    modalUI,
    headerText,
    headerSubText,
    saveButtonAction,
    cancelButtonAction
  } = props.modalConfig;

  const { setModalConfig } = props;

  const handleClose = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        open={modalVisible}
        className={`theme-modal ${modalUI.modalClass}`}
      >
        <Stack sx={{ p: 2 }}>
          <DialogTitle variant='h4' sx={{...modalUI?.headerTextStyle, p: 0 }}>
            {headerText}
          </DialogTitle >
          <Typography variant='small' sx={{...modalUI.headerSubTextStyle}}>
            {headerSubText}
          </Typography>
          {modalUI?.crossIcon &&
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        </Stack>
        <DialogContent sx={{...modalUI?.modalBodyContentStyle}}>
         {modalBodyContent}
        </DialogContent>
        { (buttonsUI?.saveButton || buttonsUI?.cancelButton) &&
          <DialogActions sx={{}}>
            {buttonsUI?.saveButton && 
            <Button  onClick={saveButtonAction}>
             {buttonsUI?.saveButtonName || "Yes"}
            </Button>
            }
              {buttonsUI?.cancelButton && 
            <Button  onClick={handleClose}>
             {buttonsUI?.cancelButtonName || "No"}
            </Button>
            }
          </DialogActions>
          }
      </BootstrapDialog>
    </React.Fragment>
  );
}
