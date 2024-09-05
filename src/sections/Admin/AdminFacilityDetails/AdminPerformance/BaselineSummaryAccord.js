import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminBaselineDataSummary, getIncentiveSettings } from "../../../../redux/admin/actions/adminPerformanceActions";
import { formatNumber } from "utils/numberFormatter";

const baselineStyleInAccordion = {
  color: "#242424",
  padding: "0.375rem 1rem",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 500,
};

const baselineStyleInAccordionHeading = {
  color: "#242424",
  padding: "0.375rem 1rem",
  fontSize: { xs: "13px", sm: "15px" },
  fontStyle: "normal",
  fontWeight: 600,
};

const BaselineSummaryAccord = ({ meter_type }) => {
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );
  const incentiveSettings = useSelector(
    (state) => state?.adminPerformanceReducer?.incentiveSettings
  );
  const { adminBaselineSummaryData } = useSelector(
    (state) => state?.adminPerformanceReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminBaselineDataSummary(facility_id, meter_type))
      .then()
      .catch((err) => {});
    if (facility_id) {
      dispatch(getIncentiveSettings(facility_id));
    }
  }, [dispatch, meter_type, facility_id]);

  const baselineSummary =
    adminBaselineSummaryData?.baseline_summary_performance_page || {};

  return (
    <Grid container display={"grid"}>
      <Grid item>
        <Typography
          sx={{
            color: "#2C77E9",
            fontSize: { xs: "14px", sm: "16px" },
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
          <Typography variant="h6" sx={baselineStyleInAccordionHeading}>
            {baselineSummary["Baseline Energy Periods"]
              ? baselineSummary["Baseline Energy Periods"]
              : "N/A"}
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
          <Typography variant="h6" sx={baselineStyleInAccordionHeading}>
            {baselineSummary["Baseline Energy Consumption"]
              ? baselineSummary["Baseline Energy Consumption"]
              : "N/A"}
          </Typography>
        </Grid>
      </Grid>
      {meter_type === 1 && (
        <Grid item container>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={baselineStyleInAccordion}>
              Baseline Peak Demand (kW)
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={baselineStyleInAccordionHeading}>
              {baselineSummary["Baseline Peak Demand"]
                ? baselineSummary["Baseline Peak Demand"]
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      )}
      <Grid item container>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={baselineStyleInAccordion}>
            Pre-Project Incentive ($)
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={baselineStyleInAccordionHeading}>
            {incentiveSettings?.preProjectIncentive
              ? formatNumber(incentiveSettings?.preProjectIncentive)
              : "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BaselineSummaryAccord;
