import {
  Box,
  Button,
  Container,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import ParticipantAgreementContent from "./ParticipantAgreementContent";
import ESignature from "components/ESignature";
import { FileUploader } from "react-drag-drop-files";
// import UploadIcon from "@mui/icons-material/Upload";
import UploadIcon from "./../../../assets/images/document-upload.svg";

const fileTypes = ["JPG", "PNG", "GIF", "PDF"];

const ParticipantAgreement = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [file, setFile] = useState(null);
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

  const handleChange = (file) => {
    setFile(file);
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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ fontSize: "1rem", width: "10.313rem" }}
            disabled={!scrolledToBottom}
            onClick={handleOpenSignatureModal}
          >
            Click to e-sign
          </Button>
          <Typography variant="small2" ml={2} mr={2}>
            Or
          </Typography>

          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            label=" Click to Upload Signed Document or drag and drop"
            maxSize={25}
            multiple={false}
          />
        </Box>
        <Button
          sx={{ fontSize: "1rem", marginTop: isSmallScreen ? 2 : 0 }}
          disabled={!scrolledToBottom}
        >
          Download as PDF
        </Button>
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
