import { Box, Button, Modal, Typography, useMediaQuery } from "@mui/material";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import NotificationsToast from "utils/notification/NotificationsToast";

const ESignature = ({ isOpen, onClose, onSubmit }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const signatureRef = useRef();

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  const handleSubmit = () => {
    if(signatureRef.current.isEmpty()){
      NotificationsToast({ message: "Signature can't be blank while signing PA", type: "error" });
      return
    }
    const signature = signatureRef.current.toDataURL();
    onSubmit(signature);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isSmallScreen ? 200 : 500,
          borderRadius: "2rem",
          bgcolor: "#fff",
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "text.secondary2" }}>
            Draw Signature
          </Typography>
          <Typography variant="small2" sx={{ color: "text.secondary2" }}>
            Use the cursor to draw your signature.
          </Typography>
        </Box>

        <SignatureCanvas
          ref={signatureRef}
          penColor="black"
          canvasProps={{
            width: isSmallScreen ? 200 : 400,
            height: 300,
          }}
          backgroundColor="#9E9D9D60"
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={clearSignature}
            style={{
              padding: "0.2rem 1rem",
              minWidth: "unset",
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{
              padding: "0.2rem 1rem",
              minWidth: "unset",
              marginLeft: "1rem",
            }}
          >
            Sign the PA
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ESignature;
