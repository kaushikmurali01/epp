import { Button, Grid, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BaselineSuccessModal = ({ setBaselineSuccessModalConfig }) => {
  const facilityDetails = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const [changeContent, setChangeContent] = useState(false);
  const navigate = useNavigate();
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

      {changeContent ? (
        <Grid container justifyContent="flex-start" gap={2}>
          <Typography variant="h4">Sign participant agreement</Typography>
          <Typography variant="p" textAlign="left">
            In order to submit your facility, signing Participant Agreement is
            required.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/participant-agreement")}
          >
            Go to Participant Agreement
          </Button>
        </Grid>
      ) : (
        <Grid container justifyContent="flex-start" gap={2}>
          <Typography variant="h4">Success!</Typography>
          {facilityDetails?.is_signed ? (
            <Typography variant="p" textAlign="left">
              Baseline model has been successfully created. You can now request
              to enroll the facility into the Program.
            </Typography>
          ) : (
            <Typography variant="p" textAlign="left">
              Baseline model has been successfully created. You can now request
              to enroll the facility into the Program after signing the{" "}
              <Typography
                sx={{
                  display: "inline-block",
                  textDecoration: "underline",
                  color: "#2C77E9",
                  fontWeight: "600",
                  textUnderlineOffset: "3px",
                  cursor: "pointer",
                }}
                onClick={() => setChangeContent(true)}
              >
                Participant Agreement.
              </Typography>
            </Typography>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default BaselineSuccessModal;
