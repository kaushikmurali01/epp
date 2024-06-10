import styled from "@emotion/styled";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  useMediaQuery
} from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Form, Formik } from "formik";
import React, { useState } from "react";

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  "& .MuiButtonGroup-firstButton": {
    borderRadius: "20.8125rem 0rem 0rem 20.8125rem",
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-middleButton": {
    borderRight: "1px solid #C9C8C8",
  },
  "& .MuiButtonGroup-lastButton": {
    borderRadius: "0 20.8125rem 20.8125rem 0",
  },
  "& .MuiButton-root": {
    "&:hover": {
      color: "#F7F7F5",
    },
  },
}));

const Performance = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [activeButton, setActiveButton] = useState(0);
  const [activeButtonPerformancePeriod, setActiveButtonPerformancePeriod] = useState(0);
  const initialValues = {};

  const PERFORMANCE_PERIOD_DATA = [
    {
      id: 1,
      heading_name: "Parameter",
      parameter: "Electricity",
      timestamp_start: "2021-05-03  23:00",
      timestamp_end: "2021-05-03  23:00",
      count: 15,
      threshold: "Upper limit",
      type: "Global/Local",
    },
    {
      id: 2,
      heading_name: "Timestamp Start",
      parameter: "NG",
      timestamp_start: "2021-05-03  23:00",
      timestamp_end: "2021-05-03 23:00",
      count: 15,
      threshold: "Lower limit",
      type: "",
    },
    {
      id: 3,
      heading_name: "Timestamp End",
      parameter: "Temperature",
      timestamp_start: "2021-05-03 23:00",
      timestamp_end: "2021-05-03  23:00",
      count: 15,
      threshold: "",
      type: "",
    },
  ];

  const buttonStyle = {
    padding: "0.44rem 1.5rem",
    lineHeight: "1",
    height: "max-content",

    ".MuiButtonGroup-firstButton": {
      BorderRight: "10px"
    }
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2E813E",
    color: "#F7F7F5",
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#EBEBEB",
    color: "#696969",
  };

  const baselineStyleInAccordion = {
    color: "#242424",
    padding: "0.375rem 1rem",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
  };

  const handleSubmit = (values) => { };

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const handlePerformancePeriodButtonClick = (index) => {
    setActiveButtonPerformancePeriod(index);
  };

  const baselineStyleInAccordionDetails = (
    <Grid container display={"grid"}>
      <Grid item>
        <Typography sx={{ color: '#2C77E9', fontSize: '14px !important', fontWeight: '500', padding: "0.375rem 1rem", }}>
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

  const performancePeriodDataSummaryInAccordionDetails = (
    <Grid item xs={12} md={activeButtonPerformancePeriod === 2 ? 12 : 9}>
      <StyledButtonGroup disableElevation variant="contained" color="primary" sx={{marginBottom: "20px"}}>
      <Button
        sx={activeButtonPerformancePeriod === 0 ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => handlePerformancePeriodButtonClick(0)}
      >
        Observe data
      </Button>
      <Button
        sx={activeButtonPerformancePeriod === 1 ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => handlePerformancePeriodButtonClick(1)}
      >
        Missing Data
      </Button>
      <Button
        sx={activeButtonPerformancePeriod === 2 ? activeButtonStyle : inactiveButtonStyle}
        onClick={() => handlePerformancePeriodButtonClick(2)}
      >
        Outliers
      </Button>
    </StyledButtonGroup>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "#2E813E20",
          boxShadow: "none",
          border: "1px solid #2E813E",
        }}
      >
        {activeButtonPerformancePeriod === 0 || activeButtonPerformancePeriod === 1 ? <MuiTable size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Parameter</TableCell>
              <TableCell>Timestamp Start</TableCell>
              <TableCell>Timestamp End</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          {Array.isArray(PERFORMANCE_PERIOD_DATA) &&
            PERFORMANCE_PERIOD_DATA?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell key={rowIndex}>{row?.id}</TableCell>
                <TableCell key={rowIndex}>{row?.parameter}</TableCell>
                <TableCell key={rowIndex}>{row?.timestamp_start}</TableCell>
                <TableCell key={rowIndex}>{row?.timestamp_end}</TableCell>
                <TableCell key={rowIndex}>{row?.count}</TableCell>
              </TableRow>
            ))}
        </MuiTable> : <MuiTable size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Parameter</TableCell>
              <TableCell>Timestamp Start</TableCell>
              <TableCell>Timestamp End</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Threshold</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          {Array.isArray(PERFORMANCE_PERIOD_DATA) &&
            PERFORMANCE_PERIOD_DATA?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell key={rowIndex}>{row?.id}</TableCell>
                <TableCell key={rowIndex}>{row?.parameter}</TableCell>
                <TableCell key={rowIndex}>{row?.timestamp_start}</TableCell>
                <TableCell key={rowIndex}>{row?.timestamp_end}</TableCell>
                <TableCell key={rowIndex}>{row?.count}</TableCell>
                <TableCell key={rowIndex}>{row?.threshold}</TableCell>
                <TableCell key={rowIndex}>{row?.type}</TableCell>
              </TableRow>
            ))}
        </MuiTable>}
      </TableContainer>
    </Grid>
  )
  return (
    <Grid container
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid item display={"flex"} justifyContent={"space-between"} gap={"1rem"}>
        <StyledButtonGroup disableElevation variant="contained" color="primary">
          <Button
            sx={activeButton === 0 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(0)}
          >
            Electricity
          </Button>
          <Button
            sx={activeButton === 1 ? activeButtonStyle : inactiveButtonStyle}
            onClick={() => handleButtonClick(1)}
          >
            Natural gas
          </Button>
        </StyledButtonGroup>
        <Typography
          variant="h6"
          sx={{
            color: "#2C77E9",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          Setting
        </Typography>
      </Grid>

      <Grid item>
        <CustomAccordion
          summary="Baseline summary"
          details={baselineStyleInAccordionDetails}
          panelId="baselineSummary"
        />

        <CustomAccordion
          summary="Performance period data summary"
          details={performancePeriodDataSummaryInAccordionDetails}
          panelId="performancePeriodDataSummary" />

        <CustomAccordion
          summary="Performance period reporting Information "
          details={""}
          panelId="performancePeriodReportingInformation "
        />

        <CustomAccordion
          summary="Performance period data visualization  "
          details={""}
          panelId="performancePeriodDataVisualization  "
        />
      </Grid>

    </Grid>
  );
};

export default Performance;
