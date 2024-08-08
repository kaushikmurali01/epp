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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const BootstrapDialog = styled(Dialog)(({ theme, evModalStyle }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    ...evModalStyle?.dialogContent,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
    ...evModalStyle?.dialogActions,
  },
  '& .MuiDialog-paper': {
    maxWidth: evModalStyle?.paperMaxWidth || 'sm', 
    ...evModalStyle?.dialogPaper,
  },
}));



export default function EvModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    modalVisible,
    modalBodyContent,
    buttonsUI,
    modalUI,
    headerText,
    headerSubText,
    saveButtonAction,
    cancelButtonAction,
    onCloseReload,
    closeButtonRedirect
  } = props.modalConfig;

  const { setModalConfig, actionButtonData } = props;

  const handelReloadPage = () => {
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    setTimeout(() => {
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      window.location.reload()
    }, 1000);
   
  }
  const handleClose = () => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
    if(onCloseReload){
      handelReloadPage();
      return;
    }
    if(closeButtonRedirect){
      navigate(closeButtonRedirect)
      return;
    }
  };

  // this is the example how we can pass the evModalStyle from props

  // const evModalStyle = {
  //   dialog: {
  //     backgroundColor: 'lightblue',
  //   },
  //   dialogContent: {
  //     backgroundColor: 'white',
  //   },
  //   dialogActions: {
  //     backgroundColor: 'lightgray',
  //   },
  //   dialogPaper: {
  //     backgroundColor: 'red',
  //   },
  //   paperMaxWidth: '720px',  // Set the desired max-width
  // }
 

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        open={modalVisible}
        className={`theme-modal ${modalUI.modalClass}`}
        evModalStyle={modalUI?.evModalStyle}
      >
        {modalUI?.showHeader && 
          <Stack sx={{ p: headerText ? 2 : 0 }}>
            {headerText && 
              <DialogTitle variant='h4' sx={{...modalUI?.headerTextStyle, p: 0 }}>
                {headerText}
              </DialogTitle >
            }
            {headerSubText && 
            <Typography variant='small' sx={{...modalUI.headerSubTextStyle}}>
              {headerSubText}
            </Typography>
            }

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
          }
        <DialogContent sx={{...modalUI?.modalBodyContentStyle}}>
         {modalBodyContent}
        </DialogContent>
        { (buttonsUI?.saveButton || buttonsUI?.cancelButton) &&
          <DialogActions sx={{...modalUI?.fotterActionStyle}}>
            {buttonsUI?.saveButton && 
            <Button sx={{...buttonsUI?.successButtonStyle}} onClick={() => {actionButtonData ? saveButtonAction(actionButtonData) : saveButtonAction()}}>
             {buttonsUI?.saveButtonName || "Yes"}
            </Button>
            }
              {buttonsUI?.cancelButton && 
            <Button sx={{...buttonsUI?.cancelButtonStyle}}  onClick={handleClose}>
             {buttonsUI?.cancelButtonName || "No"}
            </Button>
            }
          </DialogActions>
          }
      </BootstrapDialog>
    </React.Fragment>
  );
}
