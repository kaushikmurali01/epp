import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import ParticipantAgreementContent from "./ParticipantAgreementContent";
import ESignature from "components/ESignature";

const ParticipantAgreement = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const handleScrollToBottom = (isAtBottom) => {
    setScrolledToBottom(isAtBottom);
  };

  const handleOpenSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };

  const handleCloseSignatureModal = () => {
    setIsSignatureModalOpen(false);
  };

  const handleSubmitSignature = (signatureData) => {
    // Handle submission of signature data
    console.log("Signature Data:", signatureData);
  };
  return (
    <Container>
      <Box>
        <Typography
          variant="h4"
          sx={{
            textAlign: `${isSmallScreen ? "center" : ""}`,
            fontSize: "1.5rem",
            color: "text.secondary2",
            fontWeight: "700",
            marginBottom: "0.75rem",
          }}
        >
          Participant Agreement
        </Typography>
        <Typography
          variant="h4"
          sx={{
            textAlign: `${isSmallScreen ? "center" : ""}`,
            color: "text.secondary2",
            fontWeight: "400",
          }}
        >
          Read and E-Sign the participant Agreement to enrol your facility
        </Typography>
      </Box>
      <ParticipantAgreementContent onScrollToBottom={handleScrollToBottom} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "2rem",
          flexDirection: `${isSmallScreen ? "column" : "row"}`,
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: "1rem", width: "10.313rem" }}
          disabled={!scrolledToBottom}
          onClick={handleOpenSignatureModal}
        >
          Click to Sign
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button sx={{ fontSize: "1rem" }} disabled={!scrolledToBottom}>
            Upload Signed Document
          </Button>
          <Button sx={{ fontSize: "1rem" }} disabled={!scrolledToBottom}>
            Download as PDF
          </Button>
        </Box>
      </Box>
      <ESignature
        isOpen={isSignatureModalOpen}
        onClose={handleCloseSignatureModal}
        onSubmit={handleSubmitSignature}
      />
    </Container>
  );
};

export default ParticipantAgreement;
