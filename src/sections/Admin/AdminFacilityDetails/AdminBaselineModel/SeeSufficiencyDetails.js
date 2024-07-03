import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  StyledButtonGroup,
  activeButtonStyle,
  inactiveButtonStyle,
} from "./styles";
import { MiniTable } from "components/MiniTable";
import { useSelector } from "react-redux";

const SeeSufficiencyDetails = ({
  meterType,
  baselineStartDate,
  baselineEndDate,
}) => {
  const [activeButton, setActiveButton] = useState("hourly");
  const sufficiencyCheckData = useSelector(
    (state) => state?.adminBaselineReducer?.sufficiencyCheckData
  );

  const userColumn = [
    {
      Header: "Data coverage thresholds",
      accessor: (item) => (
        <Typography
          variant="span"
          sx={{
            color: item?.status === "passed" ? "primary.main" : "#FF5858",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          {activeButton === "monthly" && item?.status === "failed"
            ? Object.keys(item?.failedData)
            : `Data sufficiency
          ${item?.status}`}
        </Typography>
      ),
    },
    {
      Header: "Coverage",
      accessor: (item) => (
        <Typography
          variant="span"
          sx={{
            color: "primary.main",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          {item.sufficiency}%
        </Typography>
      ),
    },
  ];

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const getSufficiencyData = () => {
    if (sufficiencyCheckData) {
      if (activeButton === "monthly") {
        return sufficiencyCheckData["hourly"];
      }
      return sufficiencyCheckData[activeButton] || {};
    }
    return {};
  };

  const sufficiencyData = getSufficiencyData();

  return (
    <Grid container>
      <Grid container>
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={
              activeButton === "hourly"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("hourly")}
          >
            Hourly
          </Button>
          <Button
            sx={
              activeButton === "daily" ? activeButtonStyle : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("daily")}
          >
            Daily
          </Button>
          <Button
            sx={
              activeButton === "monthly"
                ? activeButtonStyle
                : inactiveButtonStyle
            }
            onClick={() => handleButtonClick("monthly")}
          >
            Monthly
          </Button>
        </StyledButtonGroup>
      </Grid>
      {activeButton !== "monthly" ? (
        <Grid
          spacing={5}
          columnGap={6}
          mt={3}
          sx={{
            display: "flex",
            width: "100%",
            background: "#CCFED5",
            alignItems: "center",
            borderRadius: "1rem ",
            padding: "1rem ",
          }}
        >
          <Grid item>
            <Typography variant="small" sx={{ fontSize: "1rem!important" }}>
              From {baselineStartDate} to {baselineEndDate}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="small">
              {sufficiencyData?.overall_sufficiency}% Data is available
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
      <Grid container mt={3}>
        <MiniTable columns={userColumn} data={[sufficiencyData]} />
      </Grid>
    </Grid>
  );
};

export default SeeSufficiencyDetails;
