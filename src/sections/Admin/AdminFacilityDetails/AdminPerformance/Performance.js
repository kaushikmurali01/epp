import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import EvModal from "utils/modal/EvModal";
import BaselineSummaryAccord from "./BaselineSummaryAccord";
import PerformancePeriodDataSummary from "./PerformancePeriodDataSummary";
import PerformancePeriodInformationAccordion from "./PerformancePeriodInformationAccordion";
import PerformancePeriodDataVisualization from "./PerformancePeriodDataVisualization";
import PerformanceSettingComponent from "./PerformanceSettingComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [activeButton, setActiveButton] = useState(1);
  const [isPerformanceSettingComponent, setIsPerformanceSettingComponent] =
    useState(false);

  const handleTabTypeClick = (index) => {
    setActiveButton(index);
  };

  const ELECTRICITY_DATA = [
    {
      id: 1,
      start_date: "2023/01/01 0:18",
      end_date: "2023/01/01 0:30",
      usage: "148.69",
    },
    {
      id: 2,
      start_date: "2023/01/01 0:18",
      end_date: "2023/01/01 0:30",
      usage: "148.69",
    },
    {
      id: 3,
      start_date: "2023/01/01 0:18",
      end_date: "2023/01/01 0:30",
      usage: "150.22",
    },
  ];

  const buttonStyle = {
    padding: "0.44rem 1.5rem",
    lineHeight: "1",
    height: "max-content",
    borderRadius: "50px",

    ".MuiButtonGroup-firstButton": {
      BorderRight: "10px",
    },
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2E813E",
    color: "#F7F7F5",
    "&:hover": {
      backgroundColor: "#2E813E",
    },
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#EBEBEB",
    color: "#696969",
  };

  const [parameterModalConfig, setParameterModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "",
      headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
      headerSubTextStyle: {
        marginTop: "1rem",
        color: "rgba(36, 36, 36, 1)",
        fontSize: { md: "0.875rem" },
      },
      fotterActionStyle: "",
      modalBodyContentStyle: "",
    },
    buttonsUI: {
      saveButton: false,
      cancelButton: false,
      saveButtonName: "Sent Request",
      cancelButtonName: "Cancel",
      saveButtonClass: "",
      cancelButtonClass: "",
    },
    modalBodyContent: "",
  });

  const openParameterModal = (parameterName) => {
    setParameterModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: parameterName,
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setParameterModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <ParameterListing parameterName={parameterName} />,
      }));
    }, 10);
  };

  const ParameterListing = ({ parameterName }) => {
    return (
      <>
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "#2E813E20",
            boxShadow: "none",
            border: "1px solid #2E813E",
          }}
        >
          <MuiTable size="small">
            <TableHead>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Usage</TableCell>
              </TableRow>
            </TableHead>
            {Array.isArray(ELECTRICITY_DATA) &&
              ELECTRICITY_DATA?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell key={rowIndex}>{row?.start_date}</TableCell>
                  <TableCell key={rowIndex}>{row?.end_date}</TableCell>
                  <TableCell key={rowIndex}>{row?.usage}</TableCell>
                </TableRow>
              ))}
          </MuiTable>
        </TableContainer>
      </>
    );
  };

  const [submitTrigger, setSubmitTrigger] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [isDateValid, setIsDateValid] = useState(false);

  const handleSubmitSavingsReport = useCallback(() => {
    setSubmitTrigger(true);
  }, []);

  const handleRefreshReport = useCallback(() => {
    setRefreshTrigger(true);
  }, []);

  const handleDateValidation = (isValid) => {
    setIsDateValid(isValid);
  };

  return (
    <>
      <Grid
        container
        sx={{
          width: "100%",
          padding: "0 2rem",
          marginTop: isSmallScreen && "2rem",
          display: "flex",
          gap: "2rem",
          flexDirection: "column",
        }}
      >
        <Grid
          item
          display={"flex"}
          justifyContent={"space-between"}
          gap={"1rem"}
        >
          {isPerformanceSettingComponent ? (
            <IconButton
              onClick={() => setIsPerformanceSettingComponent(false)}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
                marginRight: "1rem",
              }}
            >
              <ArrowBackIcon
                sx={{
                  color: "#fff",
                  fontSize: "1.25rem",
                }}
              />
            </IconButton>
          ) : (
            <>
              <StyledButtonGroup
                disableElevation
                variant="contained"
                color="primary"
              >
                <Button
                  sx={
                    activeButton === 1 ? activeButtonStyle : inactiveButtonStyle
                  }
                  onClick={() => handleTabTypeClick(1)}
                >
                  Electricity
                </Button>
                <Button
                  sx={
                    activeButton === 3 ? activeButtonStyle : inactiveButtonStyle
                  }
                  onClick={() => handleTabTypeClick(3)}
                >
                  Natural gas
                </Button>
              </StyledButtonGroup>
              <Typography
                variant="h6"
                onClick={() => {
                  setIsPerformanceSettingComponent(true);
                }}
                sx={{
                  cursor: "pointer",
                  color: "#2C77E9",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                Setting
              </Typography>
              <Button
                type="button"
                onClick={handleRefreshReport}
                sx={{
                  border: "2px solid #2E813E",
                }}
              >
                Refresh
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={handleSubmitSavingsReport}
                disabled={!isDateValid}
              >
                Submit Savings Report
              </Button>
            </>
          )}
        </Grid>

        {isPerformanceSettingComponent ? null : (
          <Grid item display={"flex"} justifyContent={"end"}>
            <Typography
              sx={{
                padding: "6px",
                backgroundColor: "#CFEEFF",
                color: "#1976AA",
                borderRadius: "12rem",
                fontStyle: "italic",
                fontSize: "14px !important",
                fontWeight: "400",
              }}
            >
              Savings Report has been submitted on 2020/03/05 13:35:01, pending
              verification
            </Typography>
          </Grid>
        )}

        {isPerformanceSettingComponent ? (
          <PerformanceSettingComponent />
        ) : (
          <Grid item>
            <CustomAccordion
              summary="Baseline summary"
              details={<BaselineSummaryAccord meter_type={activeButton} />}
              panelId="baselineSummary"
            />

            <CustomAccordion
              summary="Performance period data summary"
              details={<PerformancePeriodDataSummary />}
              panelId="performancePeriodDataSummary"
            />

            <CustomAccordion
              summary="Performance period reporting Information"
              details={
                <PerformancePeriodInformationAccordion
                  meter_type={activeButton}
                  submitTrigger={submitTrigger}
                  refreshTrigger={refreshTrigger}
                  onDateValidation={handleDateValidation}
                />
              }
              panelId="performancePeriodReportingInformation"
            />

            <CustomAccordion
              summary="Performance period data visualization"
              details={<PerformancePeriodDataVisualization />}
              panelId="performancePeriodDataVisualization"
            />
          </Grid>
        )}
      </Grid>
      <EvModal
        modalConfig={parameterModalConfig}
        setModalConfig={setParameterModalConfig}
      />
    </>
  );
};

export default Performance;
