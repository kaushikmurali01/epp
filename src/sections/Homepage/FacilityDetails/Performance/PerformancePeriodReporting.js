import {
  Button,
  FormLabel,
  Grid,
  Tab,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Table as MuiTable,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import SelectBox from "components/FormBuilder/Select";
import { Formik } from "formik";
import React, { useState } from "react";
import { Form } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EvModal from "utils/modal/EvModal";
import InputField from "components/FormBuilder/InputField";
import TextAreaField from "components/FormBuilder/TextAreaField";

const performancePeriodStyleInArea = {
  // textAlign: "center",
  // justifyContent: "center",
  display: "flex",
  alignItems: "center",
  // marginTop: "12px",
};

const PerformancePeriodReporting = () => {
  const [performanceTabs, setPerformanceTabs] = useState("firstPayDay");
  const handleChangePerformance = (event, newValue) => {
    setPerformanceTabs(newValue);
  };
  const [initialValues, setInitialValues] = useState({
    adjusted_baseline: "",
    reporting_period_NG_consumption: "",
    non_routine_adjustment: "",
    NG_savings: "",
    NG_savings_percentage: "",
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
  const [nonRoutineListingModalConfig, setNonRoutineListingModalConfig] =
    useState({
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


  const NonRoutineListing = () => {
    const [modalNonRoutineTabs, setModalNonRoutineTabs] =
      useState("filledData");

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
                display: "inline-flex",
                flexWrap: "wrap",
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
        {modalNonRoutineTabs == "filledData" ? (
          <>
            <TableContainer>
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
                          format="dd/MM/yyyy"
                        />
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
                          format="dd/MM/yyyy"
                        />
                      </TableCell>
                      <TableCell key={rowIndex}>
                        <TextField />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FF5858 !important",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        Delete
                      </TableCell>
                    </TableRow>
                  ))}
              </MuiTable>
            </TableContainer>
            <Grid item container sx={{ marginTop: "20px" }}>
              <Button
                type="button"
                sx={{
                  backgroundColor: "#2E813E",
                  color: "#ffffff",
                  marginRight: "20px",
                  "&:hover": {
                    backgroundColor: "#2E813E",
                  },
                }}
              >
                Done
              </Button>
              <Button
                type="button"
                sx={{
                  border: "2px solid #2E813E",
                }}
              >
                Add more row
              </Button>
            </Grid>
          </>
        ) : !isFileUploaded ? (
          <Box>
            <Typography variant="h5">
              Upload data in bulk for ‘non-routine event name’
            </Typography>
            <Typography variant="small2" gutterBottom>
              Upload the excel file, and refer to Non-Routine Adjustment
              spreadsheet for the formatting details.
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
  const NonRoutineModal = () => {
    const handleSubmit = (values) => {};

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
                  format="dd/MM/yyyy"
                />
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
                  format="dd/MM/yyyy"
                />
              </Grid>
            </Grid>

            <Grid item container sx={{ marginTop: "20px" }}>
              <Grid item xs={12} md={6}>
                <InputField name="event_name" label="Event name" type="text" />
              </Grid>
            </Grid>

            <Grid sx={{ marginTop: "20px" }}>
              <FormLabel>Comment</FormLabel>
            </Grid>
            <Grid item container>
              <Grid item xs={12} md={6}>
                <TextAreaField name="comment" type="text" rows={8} />
              </Grid>
            </Grid>

            <Grid item container sx={{ marginTop: "20px" }}>
              <Grid item xs={12} md={6}>
                <Button
                  type="button"
                  sx={{
                    backgroundColor: "#2E813E",
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "#2E813E",
                    },
                  }}
                  onClick={() => {
                    closeNonRoutineModal();
                    openNonRoutineListingModal();
                  }}
                >
                  Create non-routine event
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </>
    );
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
        <Grid item xs={12} md={9}>
          <Tabs
            className="theme-tabs-list"
            value={performanceTabs}
            onChange={handleChangePerformance}
            sx={{
              display: "inline-flex",
              flexWrap: "wrap",
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
            endIcon={
              <AddCircleIcon
                style={{
                  color: "text.primary",
                  fontSize: "2rem",
                }}
              />
            }
            onClick={() => openNonRoutineModal()}
          >
            Add non-routine event
          </Button>
        </Grid>
      </Grid>

      <Grid item container flexWrap={"nowrap"} gap={"1rem"}>
        <Grid
          item
          xs={12}
          md={9}
          sx={{
            border: "1px solid #2E813E",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "#CBFFD5",
          }}
        >
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
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
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
                        format="dd/MM/yyyy"
                      />
                    </Grid>
                    <Grid item xs={12} md={2} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
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
                        format="dd/MM/yyyy"
                      />
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
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        10,345,443
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="adjusted_baseline"
                        options={savingReportDropdown}
                      />
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
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        -41,137
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="reporting_period_NG_consumption"
                        options={savingReportDropdown}
                      />
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
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        723,192
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="non_routine_adjustment"
                        options={savingReportDropdown}
                      />
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
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        10,010
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="NG_savings"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item container sx={{ marginTop: "20px" }}>
                <Grid item xs={12} md={6} sx={performancePeriodStyleInArea}>
                  <Typography variant="h6" sx={baselineStyleInAccordion}>
                    NG savings as percentage of adjusted baseline NG consumption
                    and non-routine adjustment
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4} sx={performancePeriodStyleInArea}>
                      <Typography
                        variant="h6"
                        sx={performancePeriodStyleInAccordion}
                      >
                        6.5%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectBox
                        name="NG_savings_percentage"
                        options={savingReportDropdown}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Grid>

        <Grid
          item
          xs={12}
          md={3}
          sx={{
            border: "1px solid #2E813E",
            borderRadius: "10px",
            backgroundColor: "#CBFFD5",
          }}
        >
          <Typography variant="h6" sx={nonRoutingStyleInAccordion}>
            Non-routine event name
          </Typography>
          <Grid sx={{ background: "#E2F8E6" }}>
            <Typography
              variant="h6"
              sx={eventNameStyleInAccordion}
              onClick={() => openEventModal("Event name-1")}
            >
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
      <EvModal
        modalConfig={nonRoutinerModalConfig}
        setModalConfig={setNonRoutineModalConfig}
      />
    </>
  );
};

export default PerformancePeriodReporting;
