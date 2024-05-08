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
import UploadIcon from "@mui/icons-material/Upload";

const fileTypes = ["PDF"];

const ParticipantAgreement = (props) => {
  const {onDownloadUnsignedPA, onUploadSignature, isSigned, onDownloadSignedPA, uploadSignedPA, pdfUrl} = props
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
    console.log("Signature Data:", signatureData);
    onUploadSignature(signatureData);
  };

  const handleChange = (file) => {
    setFile(file);
    uploadSignedPA(file)
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
          {isSigned ? 'You have successfully signed the participant agreement.' : 'Read and sign the participant agreement to enrol your facilities.'}
        </Typography>
      </Box>
      <ParticipantAgreementContent onScrollToBottom={handleScrollToBottom} pdfUrl={pdfUrl} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: "2rem",
          flexDirection: `${isSmallScreen ? "column" : "row"}`,
          alignItems: "center",
        }}
      >
        {!isSigned && <Box
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
            children={
              <Button
                sx={{
                  border: "2px dashed rgb(108, 110, 112)",
                  outline: "none",
                  decoration: "none",
                }}
                startIcon={
                  <UploadIcon
                    style={{
                      color: "#111",
                      fontSize: "2rem",
                    }}
                  />
                }
              >
                <Typography
                  variant="small"
                  sx={{ color: "#2C77E9", textAlign: "left", padding: "2px" }}
                >
                  Click to Upload Signed Document{" "}
                  <Typography variant="span2">or drag and drop</Typography>
                  <br />
                  <Typography variant="span2">
                    (Max. File size: 25 MB)
                  </Typography>
                </Typography>
              </Button>
            }
          />
        </Box>}
        <Button
          sx={{ fontSize: "1rem", marginTop: isSmallScreen ? 2 : 0 }}
          disabled={!isSigned && !scrolledToBottom}
          onClick={!isSigned ? onDownloadUnsignedPA : onDownloadSignedPA}
        >
          {isSigned ? 'Download signed participant agreement' : 'Download as PDF'}
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
