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
          variant="h4"
          sx={{
            fontWeight: "700",
          }}
        >
          Participant Agreement
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "400",
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
