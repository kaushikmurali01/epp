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
  Box,
  TableBody,
  Link,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';
import SelectBox from 'components/FormBuilder/Select';
import { Formik, Form, FieldArray } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDispatch, useSelector } from 'react-redux';
import InputField from 'components/FormBuilder/InputField';
import TextAreaField from 'components/FormBuilder/TextAreaField';
import EvModal from "utils/modal/EvModal";
import { documentFileUploadAction } from "../../../../redux/global/actions/fileUploadAction";
import { addNonRoutineEvent, getNonRoutineEventList } from "../../../../redux/superAdmin/actions/performanceAction";
import Loader from "pages/Loader";
import { format, parse } from "date-fns";


const PerformancePeriodInformationAccordion = ({meterType}) => {
  const [activeButton, setActiveButton] = useState(0);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [nonRoutineFile, setNonRoutineFile] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const dispatch = useDispatch();

  const facilityId = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.id
  );

  const { loading, nonRoutineList } = useSelector((state) => state?.performanceReducer);
  
  useEffect(() => {
    dispatch(getNonRoutineEventList(facilityId));
  }, []);
  

  console.log(meterType, nonRoutineList, facilityId, "meter type + list + facility id");
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
    },
  ];
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
  const baselineStyleInAccordion = {
    color: "#242424",
    padding: "0.375rem 1rem",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: 500,
  };

  
  
  const openNonRoutineModal = () => {
    setNonRoutineModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Non-routine Event",
      modalBodyContent: <NonRoutineModal />,
    }));
  };

  const openNonRoutineListingModal = () => {
    setNonRoutineListingModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: <NonRoutineListing />,
    }));
  };

  const closeNonRoutineModal = () => {
    setNonRoutineModalConfig((prevState) => ({
      ...prevState,
      modalVisible: false,
    }));
  };

  const handleSubmit = (values) => {};

  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

const NonRoutineModal = () => {
  const initialValues = {
    event_to_period: null,
    event_to_period: null,
    event_name: "",
    event_description: "",
  };

  const handleSubmit = (values) => {
    console.log(values);
    let nonRoutinePayload = {...values, facilityId, meterType};
    dispatch(addNonRoutineEvent(nonRoutinePayload))
      .then(() => {
        console.log("added");
        closeNonRoutineModal();
        // getNonRoutineEventList();
        openNonRoutineListingModal();
      })
      .catch((error) => {
        console.log(error);
    })
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {({ values, isValid, dirty, setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="from_date">Event period from</FormLabel>
              <DatePicker
                id="event_to_period"
                name="event_to_period"
                value={values.from_date}
                onChange={(date) => setFieldValue("event_to_period", date)}
                sx={{
                  width: "100%",
                  input: { color: "#111" },
                }}
                disableFuture
                format="dd/MM/yyyy"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormLabel htmlFor="to_date">Event period to</FormLabel>
              <DatePicker
                id="event_from_period"
                name="event_from_period"
                value={values.to_date}
                onChange={(date) => setFieldValue("event_from_period", date)}
                sx={{
                  width: "100%",
                  input: { color: "#111" },
                }}
                disableFuture
                format="dd/MM/yyyy"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputField name="event_name" label="Event name" type="text" />
            </Grid>

            <Grid item container>
              <Grid item xs={12} md={6}>
                <FormLabel htmlFor="event_description">Comment</FormLabel>
                <TextAreaField name="event_description" type="text" rows={8} />
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#2E813E",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#256A32",
                  },
                }}
                disabled={!isValid || !dirty}
              >
                Create non-routine event
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

const dummyApiData = [
  {
    id: 1,
    start_date: "2023-01-01T00:00:00.000Z",
    end_date: "2023-01-31T00:00:00.000Z",
    non_routine_adjustment: "100",
  },
  {
    id: 2,
    start_date: "2023-02-01T00:00:00.000Z",
    end_date: "2023-02-28T00:00:00.000Z",
    non_routine_adjustment: "150",
  },
  {
    id: 3,
    start_date: "2023-03-01T00:00:00.000Z",
    end_date: "2023-03-31T00:00:00.000Z",
    non_routine_adjustment: "200",
  },
];

const dummyFileData = {
  file_url: "https://example.com/dummy-file.xlsx",
  file_name: "NonRoutineAdjustments.xlsx",
};

const NonRoutineListing = () => {
  const [modalNonRoutineTabs, setModalNonRoutineTabs] = useState("filledData");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [nonRoutineFile, setNonRoutineFile] = useState(null);
  const fileInputRef = useRef(null);
  const [initialData, setInitialData] = useState([]);
  const [dataType, setDataType] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly decide whether to use table data or file data
      const useTableData = Math.random() < 0.5;

      if (useTableData) {
        setInitialData(
          dummyApiData.map((item) => ({
            ...item,
            start_date: parse(
              item.start_date,
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
              new Date()
            ),
            end_date: parse(
              item.end_date,
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
              new Date()
            ),
          }))
        );
        setDataType(1);
        setModalNonRoutineTabs("filledData");
      } else {
        setNonRoutineFile(dummyFileData);
        setIsFileUploaded(true);
        setDataType(2);
        setModalNonRoutineTabs("uploadData");
      }
    };
    fetchData();
  }, []);

  const initialValues = {
    data_entries: initialData,
    non_routine_id: 1,
    file_url: nonRoutineFile ? nonRoutineFile.file_url : "",
    type: dataType,
  };

  const handleNonRoutineTabs = (event, newValue, setFieldValue) => {
    setModalNonRoutineTabs(newValue);
    setFieldValue("type", newValue === "filledData" ? 1 : 2);
  };

  const handleButtonClickForUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event, setFieldValue) => {
    const selectedFile = event.target.files[0];
    setNonRoutineFile(selectedFile);
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(selectedFile);
      setFieldValue("file_url", fakeUrl);
      setIsFileUploaded(true);
    }, 1000);
  };

  const deleteFile = (setFieldValue) => {
    setNonRoutineFile(null);
    setIsFileUploaded(false);
    setFieldValue("file_url", "");
  };

  const downloadFileFromUrl = () => {
    // Implement file download logic here
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting }) => {
        const payload = {
          ...values,
          data_entries:
            values.type === 1
              ? values.data_entries.map((entry) => ({
                  start_date: entry.start_date
                    ? format(entry.start_date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                    : null,
                  end_date: entry.end_date
                    ? format(entry.end_date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
                    : null,
                  non_routine_adjustment: entry.non_routine_adjustment,
                }))
              : [],
        };
        console.log("PATCH payload:", payload);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
              marginBottom: "2rem",
            }}
          >
            <Grid item xs={12} md={12}>
              <Tabs
                className="theme-tabs-list"
                value={modalNonRoutineTabs}
                onChange={(event, newValue) =>
                  handleNonRoutineTabs(event, newValue, setFieldValue)
                }
                sx={{ display: "inline-flex", flexWrap: "wrap" }}
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
          {modalNonRoutineTabs === "filledData" ? (
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
                  <TableBody>
                    <FieldArray name="data_entries">
                      {({ remove, push }) => (
                        <>
                          {values.data_entries.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <DatePicker
                                  value={entry.start_date}
                                  onChange={(newDate) => {
                                    setFieldValue(
                                      `data_entries[${index}].start_date`,
                                      newDate
                                    );
                                  }}
                                  sx={{
                                    width: "100%",
                                    input: { color: "#111" },
                                  }}
                                  disableFuture
                                  format="dd/MM/yyyy"
                                />
                              </TableCell>
                              <TableCell>
                                <DatePicker
                                  value={entry.end_date}
                                  onChange={(newDate) => {
                                    setFieldValue(
                                      `data_entries[${index}].end_date`,
                                      newDate
                                    );
                                  }}
                                  sx={{
                                    width: "100%",
                                    input: { color: "#111" },
                                  }}
                                  disableFuture
                                  format="dd/MM/yyyy"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={entry.non_routine_adjustment}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `data_entries[${index}].non_routine_adjustment`,
                                      e.target.value
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Link
                                  underline="hover"
                                  sx={{
                                    color: "#FF5858",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    padding: 0,
                                  }}
                                  onClick={() => remove(index)}
                                >
                                  Delete
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </TableBody>
                </MuiTable>
              </TableContainer>
              <Grid item container sx={{ marginTop: "20px" }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "#ffffff",
                    marginRight: "20px",
                    "&:hover": { backgroundColor: "primary.mainDarkShade" },
                  }}
                >
                  Done
                </Button>
                <FieldArray name="data_entries">
                  {({ push }) => (
                    <Button
                      type="button"
                      sx={{ border: "2px solid #2E813E" }}
                      onClick={() =>
                        push({
                          start_date: null,
                          end_date: null,
                          non_routine_adjustment: "",
                        })
                      }
                    >
                      Add more row
                    </Button>
                  )}
                </FieldArray>
              </Grid>
            </>
          ) : !isFileUploaded ? (
            <Box>
              <Typography variant="h5">
                Upload data in bulk for 'non-routine event name'
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                sx={{ color: "#242424", fontStyle: "italic" }}
              >
                Upload the excel file, and refer to{" "}
                <Link
                  underline="hover"
                  color={"blue.main"}
                  sx={{ cursor: "pointer" }}
                >
                  Non-Routine Adjustment spreadsheet
                </Link>{" "}
                for the formatting details.
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <Button
                  variant="contained"
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
                    ":hover": { backgroundColor: "primary.light" },
                  }}
                  onClick={handleButtonClickForUpload}
                >
                  {nonRoutineFile ? nonRoutineFile.name : "Choose File"}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(event) => handleFileChange(event, setFieldValue)}
                  accept=".xlsx,.csv"
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting || !nonRoutineFile}
                  style={{
                    padding: "0.2rem 1rem",
                    minWidth: "unset",
                    width: "165px",
                    height: "40px",
                  }}
                >
                  Upload
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "blue.main", cursor: "pointer", display: "flex" }}
                onClick={downloadFileFromUrl}
              >
                {nonRoutineFile?.name || "NonRoutineFile.xlsx"}
                <Link
                  underline="hover"
                  sx={{
                    color: "#FF5858",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteFile(setFieldValue);
                  }}
                >
                  Delete
                </Link>
              </Typography>
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "0.2rem 1rem",
                  minWidth: "unset",
                  width: "165px",
                  height: "40px",
                  marginTop: "20px",
                }}
              >
                Submit
              </Button>
            </Box>
          )}
        </Form>
      )}
    </Formik>
  );
};


  const openEventModal = (eventName) => {
    setEventNameModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "Event Detail",
      modalBodyContent: <EventPopup eventName={eventName} />,
    }));
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

  const [nonRoutinerModalConfig, setNonRoutineModalConfig] = useState({
    modalVisible: false,
    modalUI: {
      showHeader: true,
      crossIcon: false,
      modalClass: "emailArchiveModal",
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

  const [nonRoutineListingModalConfig, setNonRoutineListingModalConfig] =
    useState({
      modalVisible: false,
      modalUI: {
        showHeader: true,
        crossIcon: false,
        modalClass: "emailArchiveModal",
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
      modalClass: "emailArchiveModal",
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

  const EventPopup = ({ eventName }) => {
    return (
      <>
        <Grid container>
          <Grid
            container
            sx={{ paddingBottom: "10px", borderBottom: "1px solid #54585A" }}
          >
            <Grid item xs={12} md={9}>
              <Grid>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
                >
                  Event period
                </Typography>
                <Typography
                  sx={{ fontSize: "14px !important", color: "#242424" }}
                >
                  2021/05/07 to 2021/07/03
                </Typography>
              </Grid>
              <Grid sx={{ marginTop: "20px" }}>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
                >
                  Comment
                </Typography>
                <Typography
                  sx={{ fontSize: "14px !important", color: "#242424" }}
                >
                  Lorem ipsum dolor sit amet consectetur. Venenatis vel sed sit
                  duis pharetra neque quis nec. Amet convall
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3} sx={{ justifySelf: "flex-end" }}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
              >
                Event name
              </Typography>
              <Typography
                sx={{ fontSize: "14px !important", color: "#242424" }}
              >
                {eventName}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            sx={{
              marginTop: "10px",
              paddingBottom: "10px",
              borderBottom: "1px solid #54585A",
            }}
          >
            <Grid item xs={12} md={9}>
              <Grid>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
                >
                  Start date
                </Typography>
                <Typography
                  sx={{ fontSize: "14px !important", color: "#242424" }}
                >
                  2021/05/07
                </Typography>
              </Grid>
              <Grid sx={{ marginTop: "20px" }}>
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
                >
                  Non-routine adjustment
                </Typography>
                <Typography
                  sx={{ fontSize: "14px !important", color: "#242424" }}
                >
                  XXXXX
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={3} sx={{ justifySelf: "flex-end" }}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
              >
                End date
              </Typography>
              <Typography
                sx={{ fontSize: "14px !important", color: "#242424" }}
              >
                2021/06/07
              </Typography>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "10px" }}>
            <Grid item xs={12} md={12}>
              <Typography
                sx={{ fontSize: "14px", fontWeight: "400", color: "#54585A" }}
              >
                Upload data in bulk for ‘non-routine event name’
              </Typography>
              <Link
                underline="hover"
                sx={{
                  fontSize: "14px !important",
                  color: "#2C77E9",
                  cursor: "pointer",
                }}
              >
                fileabc.xls
              </Link>
            </Grid>
          </Grid>

          <Grid sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "blue.main",
                color: "#ffffff",
                ":hover": { backgroundColor: "#2360bc" },
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "primary.main",
                color: "#ffffff",
                marginLeft: "15px",
                ":hover": { backgroundColor: "primary.mainDarkShade" },
              }}
            >
              Download
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "danger.main",
                color: "#ffffff",
                marginLeft: "15px",
                ":hover": { backgroundColor: "danger.colorCrimson" },
              }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
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
            onClick={() => openNonRoutineListingModal()}
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

      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />

      <EvModal
        modalConfig={nonRoutinerModalConfig}
        setModalConfig={setNonRoutineModalConfig}
      />
      <EvModal
        modalConfig={nonRoutineListingModalConfig}
        setModalConfig={setNonRoutineListingModalConfig}
      />
      <EvModal
        modalConfig={eventNameModalConfig}
        setModalConfig={setEventNameModalConfig}
      />
    </>
  );
}

export default PerformancePeriodInformationAccordion;