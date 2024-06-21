import React, { useMemo, useRef, useState } from "react";
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
  FormLabel,
  Tabs,
  Tab,
  TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CustomAccordion from "components/CustomAccordion";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Form, Formik } from "formik";

import EvModal from "utils/modal/EvModal";
import TextAreaField from "components/FormBuilder/TextAreaField";
import ButtonWrapper from "components/FormBuilder/Button";
import { documentFileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import { useDispatch, useSelector } from "react-redux";

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
  const [nonRoutineListingtabValue, setNonRoutineListingtabValue] = useState("filledData");
  const [performanceTabs, setPerformanceTabs] = useState('firstPayDay');
  const [visualizationActiveButton, setVisualizationActiveButton] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [nonRoutineFile, setNonRoutineFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
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
    borderRadius: "50px",

    ".MuiButtonGroup-firstButton": {
      BorderRight: "10px"
    }
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2E813E",
    color: "#F7F7F5",
    '&:hover': {
      backgroundColor: '#2E813E',
    },
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
    cursor: "pointer",
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

  const [nonRoutineListingModalConfig, setNonRoutineListingModalConfig] = useState({
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

  const [eventNameModalConfig, setEventNameModalConfig] = useState({
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
      saveButtonName: "Edit",
      cancelButtonName: "Download",
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

  const handleChangeOfNonRoutineListing = (event, newValue) => {
    console.log(newValue, "check tabs value")
    setNonRoutineListingtabValue(newValue);
  };

  // const getNonRoutineTabsValue = useMemo((event, newValue) => {
  //     console.log(newValue, "check tabs new value")
  //   return {nonRoutineListingtabValue };
  // }, [nonRoutineListingtabValue]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setNonRoutineFile(selectedFile);
    dispatch(documentFileUploadAction(selectedFile))
      .then((data) => {
        setImgUrl(data?.sasTokenUrl);
      })
      .catch((error) => {
        console.error("Error uploading document:", error);
      });
  };

  const uploadnonRoutineFile = () => {
    uploadRoutineFile(imgUrl);
  };

  const uploadRoutineFile = (data) => {
  };

  const deleteFile = () => {
  };

  const handleButtonClickForUpload = () => {
    // Trigger the click event on the hidden file input element
    fileInputRef.current.click();
  };

  const downloadFileFromUrl = (fileUrl) => {
    fetch(imgUrl).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        let fileName = `nonRoutineFile.csv`;
        alink.download = fileName;
        alink.click();
      });
    });
  };

  const handleChangePerformance = (event, newValue) => {
    setPerformanceTabs(newValue);
  };

  const handleVisualizationButtonClick = (index) => {
    setVisualizationActiveButton(index);
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
        modalBodyContent: <NonRoutineModal />,
      }));
    }, 10);
  };

  const openNonRoutineListingModal = () => {
    setNonRoutineListingModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setNonRoutineListingModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <NonRoutineListing />,
      }));
    }, 10);
  };

  const closeNonRoutineModal = () => {
    setNonRoutineModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
    setTimeout(() => {
      setNonRoutineModalConfig((prevState) => ({
        ...prevState,
        modalVisible: false,
      }));
    }, 10);
  };

  const openEventModal = (eventName) => {
    setEventNameModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Event Detail",
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setEventNameModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <EventPopup eventName={eventName} />,
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

  const NonRoutineModal = () => {
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
                <Button
                  type="button"
                  sx={{
                    backgroundColor: "#2E813E", color: "#ffffff", '&:hover': {
                      backgroundColor: '#2E813E',
                    },
                  }}
                  onClick={() => { closeNonRoutineModal(); openNonRoutineListingModal() }}>
                  Create non-routine event
                </Button>
              </Grid>
            </Grid>

          </Form>
        </Formik>
      </>
    );
  };

  const NonRoutineListing = () => {
    const [modalNonRoutineTabs, setModalNonRoutineTabs] = useState('filledData');

    const handleNewChangeOfNonRoutineListing = (event, newValue) => {
      setModalNonRoutineTabs(newValue);
    };

    return (
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
          <Grid item xs={12} md={12}>
            <Tabs
              className="theme-tabs-list"
              value={modalNonRoutineTabs}
              onChange={handleNewChangeOfNonRoutineListing}
              sx={{
                display: 'inline-flex', flexWrap: 'wrap'
              }}
            >
              <Tab
                value="filledData"
                label="Filled data"
                sx={{ minWidth: "10rem" }}
              />
              <Tab
                value="uploadData"
                label="Upload data in bulk"
                sx={{ minWidth: "10rem" }}
              />
            </Tabs>
          </Grid>
        </Grid>
        {modalNonRoutineTabs == 'filledData' ?
          <>
            <TableContainer
            >
              <MuiTable size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#D9D9D9" }}>
                    <TableCell>Start date*</TableCell>
                    <TableCell>End date*</TableCell>
                    <TableCell>Non-routine adjustment</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                {Array.isArray(ELECTRICITY_DATA) &&
                  ELECTRICITY_DATA?.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell key={rowIndex}>
                        <DatePicker
                          id="from_date"
                          name="from_date"
                          value={new Date(row?.start_date)}
                          sx={{
                            width: "100%",
                            input: { color: "#111" },
                          }}
                          disableFuture
                          format="dd/MM/yyyy" />
                      </TableCell>
                      <TableCell key={rowIndex}>
                        <DatePicker
                          id="from_date"
                          name="from_date"
                          value={new Date(row?.end_date)}
                          sx={{
                            width: "100%",
                            input: { color: "#111" },
                          }}
                          disableFuture
                          format="dd/MM/yyyy" />
                      </TableCell>
                      <TableCell key={rowIndex}>
                        <TextField />
                      </TableCell>
                      <TableCell sx={{ color: "#FF5858 !important", fontSize: "16px", fontWeight: "600" }}>Delete</TableCell>
                    </TableRow>
                  ))}
              </MuiTable>
            </TableContainer>
            <Grid item container sx={{ marginTop: "20px" }}>
              <Button
                type="button"
                sx={{
                  backgroundColor: "#2E813E", color: "#ffffff", marginRight: "20px", '&:hover': {
                    backgroundColor: '#2E813E',
                  },
                }}>
                Done
              </Button>
              <Button
                type="button"
                sx={{
                  border: '2px solid #2E813E',
                }}>
                Add more row
              </Button>
            </Grid>
          </> : !isFileUploaded ? (
            <Box>
              <Typography variant="h5">
                Upload data in bulk for ‘non-routine event name’
              </Typography>
              <Typography variant="small2" gutterBottom>
                Upload the excel file, and refer to Non-Routine Adjustment spreadsheet for the formatting details.
              </Typography>
              <Typography
                my={1}
                sx={{
                  color: "#2E813E",
                  fontWeight: "500",
                  fontSize: "18px",
                  backgroundColor: "#D1FFDA",
                  padding: "7px 33px",
                  borderRadius: "8px",
                  height: "40px",
                  marginTop: "20px",
                  cursor: "pointer",
                  maxWidth: "fit-content",
                }}
                onClick={handleButtonClickForUpload}
              >
                {nonRoutineFile ? nonRoutineFile?.name : "Choose File"}
              </Typography>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".xlsx,.csv"
              />
              <Button
                variant="contained"
                onClick={() => uploadnonRoutineFile(imgUrl)}
                style={{
                  padding: "0.2rem 1rem",
                  minWidth: "unset",
                  width: "165px",
                  height: "40px",
                }}
                disabled={!imgUrl}
              >
                Upload
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "blue.main", cursor: "pointer", display: "flex" }}
                onClick={downloadFileFromUrl}
              >
                NonRoutineFile.xlsx
                <Typography
                  sx={{ color: "#FF5858", marginLeft: "1rem", cursor: "pointer" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteFile();
                  }}
                >
                  Delete
                </Typography>
              </Typography>
            </Box>
          )}
      </>
    );
  };

  const EventPopup = ({ eventName }) => {
    return (
      <>
        <Grid container>

          <Grid container sx={{ paddingBottom: "10px", borderBottom: "1px solid #54585A" }}>
            <Grid item xs={12} md={9}>
              <Grid>
                <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>Event period</Typography>
                <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>2021/05/07 to 2021/07/03</Typography>
              </Grid>
              <Grid sx={{ marginTop: "20px" }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>Comment</Typography>
                <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>Lorem ipsum dolor sit amet consectetur. Venenatis vel sed sit duis pharetra neque quis nec. Amet convall</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3} sx={{ justifySelf: "flex-end" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>Event name</Typography>
              <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>{eventName}</Typography>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "10px", paddingBottom: "10px", borderBottom: "1px solid #54585A"  }}>
            <Grid item xs={12} md={9}>
              <Grid>
                <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>Start date</Typography>
                <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>2021/05/07</Typography>
              </Grid>
              <Grid sx={{ marginTop: "20px" }}>
                <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>Non-routine adjustment</Typography>
                <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>XXXXX</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3} sx={{ justifySelf: "flex-end" }}>
              <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>End date</Typography>
              <Typography sx={{ fontSize: "14px !important", color: "#242424" }}>2021/06/07</Typography>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "10px" }}>
            <Grid item xs={12} md={12}>
                <Typography sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}>Upload data in bulk for ‘non-routine event name’</Typography>
                <Typography sx={{ fontSize: "14px !important", color: "#2C77E9" }}>fileabc.xls</Typography>
              </Grid>
          </Grid>

          <Grid sx={{ marginTop: "20px" }}>
            <Button
              sx={{ backgroundColor: "#2C77E9", color: "#ffffff" }}
            >
              Edit
            </Button>

            <Button
              sx={{ backgroundColor: "#2E813E", color: "#ffffff", marginLeft: "15px" }}
            >
              Download
            </Button>

            <Button
              sx={{ backgroundColor: "#FF5858", color: "#ffffff", marginLeft: "15px" }}
            >
              Delete
            </Button>
          </Grid>

        </Grid>
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
  );

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
        <Grid item xs={12} md={9}>
          <Tabs
            className="theme-tabs-list"
            value={performanceTabs}
            onChange={handleChangePerformance}
            sx={{
              display: 'inline-flex', flexWrap: 'wrap'
            }}
          >
            <Tab
              value="firstPayDay"
              label="First pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value="secondPayDay"
              label="Second pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
            <Tab
              value="thirdPayDay"
              label="Third pay-for-performance"
              sx={{ minWidth: "10rem" }}
            />
          </Tabs>
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
            <Typography variant="h6" sx={eventNameStyleInAccordion} onClick={() => openEventModal('Event name-1')}>
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
  );

  const performancePeriodDataVisualizationInAccordionDetails = (

    <>

      <Grid item display={"flex"} justifyContent={"space-between"} gap={"1rem"}>
        <Button
          sx={visualizationActiveButton === 0 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleVisualizationButtonClick(0)}
        >
          Time series
        </Button>
        <Button
          sx={visualizationActiveButton === 1 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleVisualizationButtonClick(1)}
        >
          Natural gas
        </Button>
        <Button
          sx={visualizationActiveButton === 2 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleVisualizationButtonClick(2)}
        >
          Category 1
        </Button>
        <Button
          sx={visualizationActiveButton === 3 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleVisualizationButtonClick(3)}
        >
          Category 2
        </Button>
        <Button
          sx={visualizationActiveButton === 4 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleVisualizationButtonClick(4)}
        >
          Category 3
        </Button>
      </Grid>
    </>

  );

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
              display: "flex",
              alignItems: "center",
            }}
          >
            Setting
          </Typography>
          <Button
            type="button"
            sx={{
              border: '2px solid #2E813E',
            }}>
            Refresh
          </Button>
          <Button
            type="button"
            sx={{
              backgroundColor: "#54585A", color: "#ffffff", '&:hover': {
                backgroundColor: '#54585A',
              },
            }}>
            Submit Savings Report
          </Button>
        </Grid>

        <Grid item display={"flex"} justifyContent={"end"}>
          <Typography sx={{ padding: "6px", backgroundColor: "#CFEEFF", color: "#1976AA", fontStyle: "italic", fontSize: "14px !important", fontWeight: "400" }}>
            Savings Report has been submitted on 2020/03/05 13:35:01, pending verification
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
            summary="Performance period reporting Information"
            details={performancePeriodInformationInAccordionDetails}
            panelId="performancePeriodReportingInformation" />

          <CustomAccordion
            summary="Performance period data visualization"
            details={performancePeriodDataVisualizationInAccordionDetails}
            panelId="performancePeriodDataVisualization" />
        </Grid>

      </Grid>
      <EvModal modalConfig={parameterModalConfig} setModalConfig={setParameterModalConfig} />
      <EvModal modalConfig={nonRoutinerModalConfig} setModalConfig={setNonRoutineModalConfig} />
      <EvModal modalConfig={nonRoutineListingModalConfig} setModalConfig={setNonRoutineListingModalConfig} />
      <EvModal modalConfig={eventNameModalConfig} setModalConfig={setEventNameModalConfig} />
    </>

  );
};

export default Performance;
