import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { submitRejectedBaselineDB } from "../../../../redux/superAdmin/actions/baselineAction";

const HelpRequestModal = ({ meterType, setSendHelpModalConfig }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const baselineListData = useSelector(
    (state) => state?.baselineReducer?.baselineDetailsDb?.data || []
  );
  const getIdByMeterType = (meter_type) => {
    const meter = baselineListData.find(
      (item) => item?.meter_type === meter_type
    );
    return meter ? meter?.id : null;
  };
  const baseline_id = getIdByMeterType(meterType);
  const handleSendHelpRequest = () => {
    const body = { status: "REQUESTED" };
    dispatch(submitRejectedBaselineDB(baseline_id, body));
    setSendHelpModalConfig((prevState) => ({
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
          <img src="/images/icons/iIcon.svg" alt="" />
        </figure>
      </Grid>
      <Grid container justifyContent="flex-start" gap={2}>
        <Typography variant="h4">Failed!</Typography>
        <Typography variant="p" textAlign="left">
          Please add/select other independent variables or send a request for
          assessment.
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
    </Grid>
  );
};

export default HelpRequestModal;
