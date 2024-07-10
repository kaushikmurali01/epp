import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const UserReviewBaselineModal = ({ setUserReviewBaselineModalConfig }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleReviewRequest = (data) => {
    //use edit baseline api with baseline data and status : "REVIEWED"
    setUserReviewBaselineModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };
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
        <Typography variant="h4">Success!</Typography>

        <Typography variant="p" textAlign="left">
          Baseline model has been successfully created. You can request the user
          to review the baseline.
        </Typography>
        <Grid container sx={{ justifyContent: "center" }} gap={2} mt={4}>
          <Button
            onClick={() =>
              setUserReviewBaselineModalConfig((prevState) => ({
                ...prevState,
                modalVisible: false,
              }))
            }
            sx={{
              background: "none",
              color: "#242424",
              borderColor: "#242424",
            }}
            variant="outlined"
          >
            Return back
          </Button>
          <Button variant="contained" onClick={handleReviewRequest}>
            Send review request
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserReviewBaselineModal;
