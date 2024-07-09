import { Grid, Typography } from "@mui/material";
import React from "react";

const EnrollmentModal = () => {
  return (
    <Grid
      container
      alignItems="center"
      flexDirection="column"
      textAlign="center"
      sx={{ padding: { md: "0 5%" } }}
    >
      <Grid container sx={{ justifyContent: "center" }}>
        <figure>
          <img src="/images/new_user_popup_icon.svg" alt="" />
        </figure>
      </Grid>
      <Grid container justifyContent="flex-start" gap={2}>
        <Typography variant="h4">Thank you for your interest!</Typography>

        <Typography variant="p" textAlign="left">
          We have received your enrollment request and will review it shortly.
          Our team will check the facility eligibility and other criteria to
          approve your request. Please note that this process may take some
          time. We appreciate your patience and understanding. Once your request
          is approved, you will receive a Notice of Approval. Thank you for
          choosing our program!
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EnrollmentModal;
