import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Button,
  ButtonGroup,
  Grid,
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
import { format } from "date-fns";
import Loader from "pages/Loader";
import { useSelector } from "react-redux";

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
  const [expanded, setExpanded] = useState("baselineSummary");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [isPerformanceSettingComponent, setIsPerformanceSettingComponent] =
    useState(false);

  const handleTabTypeClick = (index) => {
    setActiveButton(index);
  };

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

  const { loading, processing } = useSelector(
    (state) => state?.adminPerformanceReducer
  );

  const [submitTrigger, setSubmitTrigger] = useState(false);

  const [isDateValid, setIsDateValid] = useState(false);

  const [submittedP4P, setSubmittedP4P] = useState(false);
  const [submissionDate, setSubmissionDate] = useState(null);
  const [verifiedP4P, setVerifiedP4P] = useState(false);
  const [verificationDate, setVerificationDate] = useState(null);
  const [performanceType, setPerformanceType] = useState(null);

  const handleSubmittedP4PsChange = useCallback((newSubmittedP4P) => {
    setSubmittedP4P(newSubmittedP4P);
  }, []);
  
  const handleVerifiedP4PsChange = useCallback((newVerifiedP4P) => {
    setVerifiedP4P(newVerifiedP4P);
  }, []);

  const handleSubmissionDate = useCallback((newDate) => {
    setSubmissionDate(newDate ? new Date(newDate) : null);
  }, []);

  const handleVerificationDate = useCallback((newDate) => {
    setVerificationDate(newDate ? new Date(newDate) : null);
  }, []);

  const handlePerformanceTypeChange = useCallback((newPerformanceType) => {
    setPerformanceType(newPerformanceType);
  }, []);

  const handleSubmitSavingsReport = useCallback(() => {
    setSubmitTrigger(true);
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
          padding: { xs: "0", md: "0 2rem" },
          marginTop: isSmallScreen && "2rem",
          display: "flex",
          gap: "2rem",
          flexDirection: "column",
        }}
      >
        <Grid
          item
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={"1rem"}
          width={"100%"}
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
              {/* {!submittedP4P && (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleSubmitSavingsReport}
                  disabled={!isDateValid}
                >
                  Submit Savings Report
                </Button>
              )} */}
            </>
          )}
        </Grid>

        {/* {submittedP4P && submissionDate && (
          <Grid item display="flex" justifyContent="end" width="100%">
            <Typography
              sx={{
                padding: "6px 8px 6px 8px",
                backgroundColor: "#CFEEFF",
                color: "#1976AA",
                borderRadius: "12rem",
                fontStyle: "italic",
                fontSize: { xs: "12px", md: "14px !important" },
                fontWeight: "400",
              }}
            >
              Savings Report has been submitted on{" "}
              {format(submissionDate, "yyyy-MM-dd, HH:MM")}, pending
              verification
            </Typography>
          </Grid>
        )} */}

        {isPerformanceSettingComponent ? (
          <PerformanceSettingComponent />
        ) : (
          <Grid item width={"100%"}>
            <CustomAccordion
              summary="Baseline summary"
              details={<BaselineSummaryAccord meter_type={activeButton} />}
              panelId="baselineSummary"
              expanded={expanded}
              onChange={handleAccordionChange}
            />

            <CustomAccordion
              summary="Performance period data summary"
              details={
                <PerformancePeriodDataSummary meter_type={activeButton} />
              }
              panelId="performancePeriodDataSummary"
              expanded={expanded}
              onChange={handleAccordionChange}
            />

            <CustomAccordion
              summary="Performance period reporting Information"
              details={
                <PerformancePeriodInformationAccordion
                  meter_type={activeButton}
                  submitTrigger={submitTrigger}
                  setSubmitTrigger={setSubmitTrigger}
                  onDateValidation={handleDateValidation}
                  onSubmittedP4PsChange={handleSubmittedP4PsChange}
                  onSubmissionDateChange={handleSubmissionDate}
                  onVerifiedP4PsChange={handleVerifiedP4PsChange}
                  onVerificationDateChange={handleVerificationDate}
                  onPerformanceTypeChange={handlePerformanceTypeChange}
                />
              }
              panelId="performancePeriodReportingInformation"
              expanded={expanded}
              onChange={handleAccordionChange}
            />

            <CustomAccordion
              summary="Performance period data visualization"
              // details={<PerformancePeriodDataVisualization />}
              panelId="performancePeriodDataVisualization"
              expanded={expanded}
              onChange={handleAccordionChange}
            />
          </Grid>
        )}
      </Grid>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </>
  );
};

export default Performance;
