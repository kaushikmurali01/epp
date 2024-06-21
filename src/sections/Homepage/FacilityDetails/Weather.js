import {
  Box,
  Button,
  Grid,
  Paper,
  Table as MuiTable,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  TableBody,
  Tabs,
  Tab,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { useSelector } from "react-redux";
import { GET_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { validationSchemaIndependentVariable } from "utils/validations/formValidation";
import ButtonWrapper from "components/FormBuilder/Button";
import EvModal from "utils/modal/EvModal";
import { useDispatch } from "react-redux";
import { documentFileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import { WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS } from "constants/apiEndPoints";

const Weather = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);
  const [independentVarsList, setIndependentVarList] = useState([])
  const dispatch = useDispatch();
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const [tabValue, setTabValue] = useState("weather");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [independentVariable1File, setIndependentVariable1File] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [checked, setChecked] = useState(true);
  const initialValues = {};
  const LAT_LONG_DATA = [
    {
      station_name: "Toronto city centre weather station",
      lattitude: 43.644,
      longitude: -79.403,
      climate_id: "",
      station_id: ""
    },
    {
      station_name: "Toronto city weather station",
      lattitude: 43.67,
      longitude: -79.4,
      climate_id: "6158355",
      station_id: "31688"
    },
    {
      station_name: "Toronto INTL A weather station",
      lattitude: 43.67,
      longitude: -79.4,
      climate_id: "6158731",
      station_id: "51459"
    }
  ];

  const [modalConfig, setModalConfig] = useState({
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
    headerText: "Add Entry",
    headerSubText:
      "Please enter the following details to add a new entry for this meter",
    modalBodyContent: "",
  });

  const openRequestModal = (isEdit, data) => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: !isEdit ? "Add independent variable" : "Edit independent variable",
      modalBodyContent: "",
    }));
    setTimeout(() => {
      setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <AddEditIndependentVariable isEdit={isEdit} data={data} />,
      }));
    }, 10);
  };

  useEffect(() => {
    getIndependentVariales();
  }, facilityData?.id)

  const getIndependentVariales = () => {
    const apiURL = WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.GET_INDEPENDENT_VARIABLE+`/${facilityData?.id}`;
    GET_REQUEST(apiURL).then((response) => {
      if(response?.data?.length){
        setIndependentVarList(response?.data)
      }
    });
  }

  const AddEditIndependentVariable = ({ isEdit, data }) => {
    const formSubmit = (data) => {
      const apiURL = WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.ADD_INDEPENDENT_VARIABLE;
      const body = {...data, facility_id: facilityData?.id};
      POST_REQUEST(apiURL, body).then((response) => {
        
      });
    };
    return (
      <>
        <Formik
          initialValues={{ ...initialValues }}
          validationSchema={validationSchemaIndependentVariable}
          enableReinitialize={true}
          onSubmit={formSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="name"
                  label="Independent Variable Name"
                  type="text" />
              </Stack>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="description"
                  label="Independent Variable Description"
                  type="text" />
              </Stack>

              <Grid display="flex" sx={{ marginTop: "1rem" }}>
                <ButtonWrapper type="submit" variant="contained">
                  Add
                </ButtonWrapper>
              </Grid>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  const handleSubmit = (values) => { };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleButtonClick = () => {
    // Trigger the click event on the hidden file input element
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setIndependentVariable1File(selectedFile)
    dispatch(documentFileUploadAction(selectedFile))
      .then((data) => {
        setImgUrl(data?.sasTokenUrl);
      })
      .catch((error) => {
        console.error("Error uploading document:", error);
      });
  };

  const downloadFileFromUrl = (fileUrl) => {
    fetch(imgUrl).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        let fileName = `_independent_variable1_file.csv`
        alink.download = fileName;
        alink.click();
      });
    });
  };

  const handleCheckboxChange = (event) => { setChecked(event.target.checked); };

  return (
    <><Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >

      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      >
        <Grid item xs={12} md={8}>
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleChange}
            sx={{ display: "inline-flex", maxWidth: "100%",}}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              value="weather"
              label="Weather"
              sx={{ minWidth: "10rem", maxWidth: "10rem" }} />
              {independentVarsList?.length ? independentVarsList.map((item, i) => {
                return <Tab
                value={item?.name}
                label={item?.name}
                sx={{ minWidth: "10rem",  maxWidth: "10rem"  }}
              />
              }) : null
              }
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
            onClick={() => openRequestModal(false)}
          >
            Add Independent Variable
          </Button>
        </Grid>
      </Grid>

      {tabValue == 'weather' ? <Box>
        <Grid
          container
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1rem",
            marginBottom: "3rem",
          }}
        >
          <Grid item xs={12} md={7} sx={{ textAlign: "center" }}>
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
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      
                    </TableCell>
                    {Array.isArray(LAT_LONG_DATA) &&
                      LAT_LONG_DATA?.map((type, index) => (
                        <TableCell
                          key={type.meterType}
                          sx={{ color: "#111", fontStyle: "italic" }}
                        >
                          {type?.["station_name"]}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Latitude
                    </TableCell>
                    {Array.isArray(LAT_LONG_DATA) &&
                      LAT_LONG_DATA?.map((type, index) => (
                        <TableCell
                          key={type.meterType}
                          sx={{ color: "#111", fontStyle: "italic" }}
                        >
                          {type?.["lattitude"]}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Longitude
                    </TableCell>
                    {Array.isArray(LAT_LONG_DATA) &&
                      LAT_LONG_DATA?.map((count, index) => (
                        <TableCell key={index} sx={{ color: "#111" }}>
                          {count?.["longitude"]}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Climate ID
                    </TableCell>
                    {Array.isArray(LAT_LONG_DATA) &&
                      LAT_LONG_DATA?.map((count, index) => (
                        <TableCell key={index} sx={{ color: "#111" }}>
                          {count?.["climate_id"]}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Station ID
                    </TableCell>
                    {Array.isArray(LAT_LONG_DATA) &&
                      LAT_LONG_DATA?.map((count, index) => (
                        <TableCell key={index} sx={{ color: "#111" }}>
                          {count?.["lattitude"]}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Grid>
          <Grid container item xs={12} md={5} sx={{ padding: " 0px 17px" }}>
            <Typography>Select checkboxes to see graphs</Typography>
            <Grid item xs={12} md={6}>
              <Formik
                initialValues={{ ...initialValues }}
                // validationSchema={validationSchemaFacilityDetails}
                // onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                <Form>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          name=""
                          type="checkbox"
                          as={Checkbox}
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="air_temperature"
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Air temprature
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          name=""
                          type="checkbox"
                          as={Checkbox}
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="relative_humidity"
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Relative humidity
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          name=""
                          type="checkbox"
                          as={Checkbox}
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="participation"
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Precipitation
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Form>
              </Formik>
            </Grid>
            <Grid item xs={12} md={6}>
              <Formik
                initialValues={{ ...initialValues }}
                // validationSchema={validationSchemaFacilityDetails}
                // onSubmit={handleSubmit}
                enableReinitialize={true}
              >
                <Form>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          name=""
                          type="checkbox"
                          as={Checkbox}
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="atmospheric_pressure"
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Atmospheric pressure
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          name=""
                          type="checkbox"
                          as={Checkbox}
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="wind_speed"
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Wind speed
                        </Typography>
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Field
                          name=""
                          type="checkbox"
                          as={Checkbox}
                          checked={checked}
                          onChange={handleCheckboxChange}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      name="daily_solar_radiation"
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          Daily solar radiation (Horizontal)
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        </Grid>
      </Box> : (
        !isFileUploaded ? <Box>
          <Typography variant="h5">
            Upload data in bulk for independent variable 1
          </Typography>
          <Typography variant="small2" gutterBottom>
            Upload the excel file, and refer to spreadsheet for the formatting details.
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
              maxWidth: 'fit-content'
            }}
            onClick={handleButtonClick}
          >
            {independentVariable1File ? independentVariable1File?.name : 'Choose File'}
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
            // onClick={() => uploadIndepentVariable1File(imgUrl)}
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
        </Box> : <Box>
          <Typography variant='h6' sx={{ color: 'blue.main', cursor: 'pointer', display: 'flex' }} onClick={downloadFileFromUrl}>
            _independent_variable1_file.xlsx
            <Typography sx={{ color: '#FF5858', marginLeft: '1rem', cursor: 'pointer' }} onClick={(event) => { event.stopPropagation() }}>Delete</Typography>
          </Typography>
        </Box>
      )}

    </Box>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </>
  );
};

export default Weather;
