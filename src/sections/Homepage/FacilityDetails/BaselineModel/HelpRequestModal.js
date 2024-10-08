import { Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchBaselineDetailsFromDb,
  submitRejectedBaselineDB,
} from "../../../../redux/superAdmin/actions/baselineAction";

const HelpRequestModal = ({
  meterType,
  setSendHelpModalConfig,
  helpSent = false,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const baselineListData = useSelector(
    (state) => state?.baselineReducer?.baselineDetailsDb?.data || []
  );
  const [helpSentSuccess, setHelpSentSuccess] = useState(helpSent);
  const getIdByMeterType = (meter_type) => {
    const meter = baselineListData.find(
      (item) => item?.meter_type === meter_type
    );
    return meter ? meter?.id : null;
  };
  const baseline_id = getIdByMeterType(meterType);
  const handleSendHelpRequest = () => {
    const body = { status: "REQUESTED" };
    dispatch(submitRejectedBaselineDB(baseline_id, body)).then(() => {
      dispatch(fetchBaselineDetailsFromDb(id));
      setHelpSentSuccess(true);
    });
    // setSendHelpModalConfig((prevState) => ({
    //   ...prevState,
    //   modalVisible: false,
    // }));
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
          <img src="/images/icons/iIcon.svg" alt="" />
        </figure>
      </Grid>
      {helpSentSuccess ? (
        <>
          <Grid container justifyContent="flex-start" gap={2}>
            <Typography variant="h4">Help request received!</Typography>
            <Typography variant="p" textAlign="left">
              We have received your request for assistance. Our team is ready to
              help you with the baseline model. We will get back to you shortly
              with the necessary guidance and support. Thank you for reaching
              out to us!
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <Grid container justifyContent="flex-start" gap={2}>
            <Typography variant="h4">Failed!</Typography>
            <Typography variant="p" textAlign="left">
              Please add/select other independent variables or send a request
              for assessment.
            </Typography>
          </Grid>
          <Grid container sx={{ justifyContent: "center" }} gap={2} mt={4}>
            <Button
              onClick={() =>
                setSendHelpModalConfig((prevState) => ({
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
            <Button variant="contained" onClick={handleSendHelpRequest}>
              Send help request
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default HelpRequestModal;
