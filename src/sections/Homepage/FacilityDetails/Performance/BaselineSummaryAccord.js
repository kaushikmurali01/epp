import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBaselineDataSummary } from "../../../../redux/superAdmin/actions/performanceAction";
const baselineStyleInAccordion = {
  color: "#242424",
  padding: "0.375rem 1rem",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
};
const BaselineSummaryAccord = () => {
  const summaryData = useSelector(
    (state) => state?.performanceReducer?.baselineSummaryData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const summaryBody = {facility_id:24, meter_id:1}
    dispatch(getBaselineDataSummary(summaryBody));
  }, [dispatch]);
  
  return (
    <Grid container display={"grid"}>
      <Grid item>
        <Typography
          sx={{
            color: "#2C77E9",
            fontSize: "14px !important",
            fontWeight: "500",
            padding: "0.375rem 1rem",
          }}
        >
          Baseline Energy Model
        </Typography>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Baseline Periods
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Baseline Energy Consumption (kWh)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Baseline Peak Demand (kW)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Pre-Project Incentive ($)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            XXXX
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BaselineSummaryAccord;
