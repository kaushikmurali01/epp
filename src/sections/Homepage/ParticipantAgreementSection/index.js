import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import ParticipantAgreementContent from "./ParticipantAgreementContent";

const ParticipantAgreement = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Container sx={{ mt: 15 }}>
      <Box>
        <Typography
          vari20ant="h4"
          sx={{
            fontSize: "1.5rem",
            color: "text.secondary2",
            fontWeight: "700",
          }}
        >
          Participant Agreement
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            color: "text.secondary2",
            fontWeight: "400",
            fontSize: "1.125rem",
          }}
        >
          Read and E-Sign the participant Agreement to enrol your facility
        </Typography>
      </Box>
      <ParticipantAgreementContent />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          flexDirection: `${isSmallScreen ? "column" : "row"}`,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: "1rem", width: "10.313rem" }}
        >
          Click to Sign
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button sx={{ fontSize: "1rem" }}>Upload Signed Document</Button>
          <Button sx={{ fontSize: "1rem" }}>Download as PDF</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ParticipantAgreement;
