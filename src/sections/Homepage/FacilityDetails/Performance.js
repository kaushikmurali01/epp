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
  useMediaQuery,
  FormLabel
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CustomAccordion from "components/CustomAccordion";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import EvModal from "utils/modal/EvModal";
import TextAreaField from "components/FormBuilder/TextAreaField";
import ButtonWrapper from "components/FormBuilder/Button";

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
  const savingReportDropdown = [
    {
      id: 1,
      name: "Estimated",
      label: "Estimated",
      value: "Estimated",
    },
    {
      id: 2,
      name: "Submitted",
      label: "Submitted",
      value: "Submitted",
    },
    {
      id: 3,
      name: "Verified",
      label: "Verified",
      value: "Verified",
    }
  ]

  const [initialValues, setInitialValues] = useState({
    adjusted_baseline: "",
    reporting_period_NG_consumption: "",
    non_routine_adjustment: "",
    NG_savings: "",
    NG_savings_percentage: "",
  });

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

  const performancePeriodStyleInAccordion = {
    color: "#2E813E",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
  };

  const performancePeriodStyleInArea = {
    // textAlign: "center",
    // justifyContent: "center",
    display: "flex",
    alignItems: "center",
    // marginTop: "12px",
  };

  const nonRoutingStyleInAccordion = {
    color: "#242424",
    padding: "20px",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
  };

  const eventNameStyleInAccordion = {
    color: "#2C77E9",
    padding: "10px 20px",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
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


  const [nonRoutinerModalConfig, setNonRoutineModalConfig] = useState({
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

  const handleSubmit = (values) => { };

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  const handlePerformancePeriodButtonClick = (index) => {
    setActiveButtonPerformancePeriod(index);
  };

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

  const openNonRoutineModal = () => {
    setNonRoutineModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Non-routine Event",
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setNonRoutineModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <NonRoutineModa />,
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

  const NonRoutineModa = () => {
    return (
      <>
        <Formik
          initialValues={{ ...initialValues }}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid item container spacing={2}>

              <Grid item xs={12} md={6}>
                <FormLabel>Event period from</FormLabel>
                <DatePicker
                  id="from_date"
                  name="from_date"
                  sx={{
                    width: "100%",
                    input: { color: "#111" },
                  }}
                  disableFuture
                  format="dd/MM/yyyy" />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormLabel>Event period to</FormLabel>
                <DatePicker
                  id="to_date"
                  name="to_date"
                  sx={{
                    width: "100%",
                    input: { color: "#111" },
                  }}
                  disableFuture
                  format="dd/MM/yyyy" />
              </Grid>

            </Grid>

            <Grid item container sx={{ marginTop: "20px" }}>
              <Grid item xs={12} md={6}>
                <InputField
                  name="event_name"
                  label="Event name"
                  type="text"
                />
              </Grid>
            </Grid>

            <Grid sx={{ marginTop: "20px" }}>
              <FormLabel>Comment</FormLabel>
            </Grid>
            <Grid item container>
              <Grid item xs={12} md={6}>
                <TextAreaField
                  name="comment"
                  type="text"
                  rows={8}
                />
              </Grid>
            </Grid>

            <Grid item container sx={{ marginTop: "20px" }}>
              <Grid item xs={12} md={6}>
                <ButtonWrapper
                  type="button"
                  color="neutral"
                >
                  Create non-routine event
                </ButtonWrapper>
              </Grid>
            </Grid>

          </Form>
        </Formik>
      </>
    );
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
      <StyledButtonGroup disableElevation variant="contained" color="primary" sx={{ marginBottom: "20px" }}>
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
                <TableCell key={rowIndex} sx={{ color: "#2C77E9 !important" }} onClick={() => openParameterModal(row?.parameter)}>{row?.parameter}</TableCell>
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
                <TableCell key={rowIndex} sx={{ color: "#2C77E9 !important" }} onClick={() => openParameterModal(row?.parameter)}>{row?.parameter}</TableCell>
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

  const performancePeriodInformationInAccordionDetails = (

    <>
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      >
        <Grid item xs={12} md={6}>
        </Grid>
        <Grid item sx={{ justifySelf: "flex-end" }}>
          <Button
            style={{
              backgroundColor: "transparent",
              padding: 0,
              minWidth: "unset",
              fontSize: "0.875rem",
            }}
            disableRipple
            endIcon={<AddCircleIcon
              style={{
                color: "text.primary",
                fontSize: "2rem",
              }} />}
            onClick={() => openNonRoutineModal()}
          >
            Add non-routine event
          </Button>
        </Grid>
      </Grid>

      <Grid item container>

        <Grid item xs={12} md={9} sx={{ border: "1px solid #2E813E", borderRadius: "10px", padding: '20px', backgroundColor: '#CBFFD5' }}>
          <Formik
            enableReinitialize={true}
            initialValues={{ ...initialValues }}
          >
            <Form>

              <Grid item container>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Pay-for-performance period
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={2} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        From
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        id="from_date"
                        name="from_date"
                        sx={{
                          width: "100%",
                          input: { color: "#111" },
                        }}
                        disableFuture
                        format="dd/MM/yyyy" />
                    </Grid>
                    <Grid item xs={12} md={2} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        To
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        id="to_date"
                        name="to_date"
                        sx={{
                          width: "100%",
                          input: { color: "#111" },
                        }}
                        disableFuture
                        format="dd/MM/yyyy" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Adjusted baseline NG consumption
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        10,345,443
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="adjusted_baseline"
                        options={savingReportDropdown} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Reporting period NG consumption
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        -41,137
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="reporting_period_NG_consumption"
                        options={savingReportDropdown} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    Non-routine adjustment
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        723,192
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="non_routine_adjustment"
                        options={savingReportDropdown} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    NG savings
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        10,010
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="NG_savings"
                        options={savingReportDropdown} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    NG savings as percentage of adjusted baseline NG consumption and non-routine adjustment
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography variant="h6" sx={performancePeriodStyleInAccordion}>
                        6.5%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="NG_savings_percentage"
                        options={savingReportDropdown} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

            </Form>
          </Formik>
        </Grid>

        <Grid item xs={12} md={3} sx={{ border: "1px solid #2E813E", borderRadius: "10px", backgroundColor: '#CBFFD5' }}>
          <Typography variant="h6" sx={nonRoutingStyleInAccordion}>
            Non-routine event name
          </Typography>
          <Grid sx={{ background: "#E2F8E6" }}>
            <Typography variant="h6" sx={eventNameStyleInAccordion}>
              Event name-1
            </Typography>
            <Typography variant="h6" sx={eventNameStyleInAccordion}>
              Event name-2
            </Typography>
            <Typography variant="h6" sx={eventNameStyleInAccordion}>
              Event name-3
            </Typography>
            <Typography variant="h6" sx={eventNameStyleInAccordion}>
              Event name-4
            </Typography>
            <Typography variant="h6" sx={eventNameStyleInAccordion}>
              Event name-5
            </Typography>
          </Grid>
        </Grid>

      </Grid>

    </>
  )

  return (

    <>
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
            panelId="baselineSummary" />

          <CustomAccordion
            summary="Performance period data summary"
            details={performancePeriodDataSummaryInAccordionDetails}
            panelId="performancePeriodDataSummary" />

          <CustomAccordion
            summary="Performance period reporting Information "
            details={performancePeriodInformationInAccordionDetails}
            panelId="performancePeriodReportingInformation " />

          <CustomAccordion
            summary="Performance period data visualization  "
            details={""}
            panelId="performancePeriodDataVisualization  " />
        </Grid>

      </Grid>
      <EvModal modalConfig={parameterModalConfig} setModalConfig={setParameterModalConfig} />
      <EvModal modalConfig={nonRoutinerModalConfig} setModalConfig={setNonRoutineModalConfig} />
    </>

  );
};

export default Performance;
