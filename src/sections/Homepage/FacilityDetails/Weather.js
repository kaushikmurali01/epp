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
import InputField from "components/FormBuilder/InputField";
import SelectBox from "components/FormBuilder/Select";
import { Field, Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { validationSchemaIndependentVariable } from "utils/validations/formValidation";
import ButtonWrapper from "components/FormBuilder/Button";
import EvModal from "utils/modal/EvModal";
import { useDispatch } from "react-redux";
import { documentFileUploadAction } from "../../../redux/global/actions/fileUploadAction";

const Weather = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState("weather");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [independentVariable1File, setIndependentVariable1File] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [checked, setChecked] = useState(true);
  const initialValues = {};
  const METER_TYPE_ARRAY = [
    { id: 1, value: "Electricity" },
    { id: 2, value: "Water" },
    { id: 3, value: "Natural Gas" },
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

  const AddEditIndependentVariable = ({ isEdit, data }) => {
    const formSubmit = (data) => {
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
                  name="independentVariableName"
                  label="Independent Variable Name"
                  type="text" />
              </Stack>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="independentVariableDescription"
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
        <Grid item xs={12} md={6}>
          <Tabs
            className="theme-tabs-list"
            value={tabValue}
            onChange={handleChange}
            sx={{ display: "inline-flex" }}
          >
            <Tab
              value="weather"
              label="Weather"
              sx={{ minWidth: "10rem" }} />
            <Tab
              value="independentVariable1"
              label="Independent variable 1"
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
          <Grid item xs={12} md={6} sx={{ textAlign: "center"}}>
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
                      Latitude
                    </TableCell>
                    {/* {Array.isArray(meterStatistics) &&
        meterStatistics?.map((type, index) => (
          <TableCell
            key={type.meterType}
            sx={{ color: "#111", fontStyle: "italic" }}
          >
            {type?.["Meter type"]}
          </TableCell>
        ))} */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Longitude
                    </TableCell>
                    {/* {Array.isArray(meterStatistics) &&
        meterStatistics?.map((count, index) => (
          <TableCell key={index} sx={{ color: "#111" }}>
            {count?.["Total meters"]}
          </TableCell>
        ))} */}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Climate ID
                    </TableCell>
                    {/* {Array.isArray(meterStatistics) &&
        meterStatistics?.map((date, index) => (
          <TableCell key={index} sx={{ color: "#111" }}>
            {count?.["Total meters"]}
          </TableCell>
        ))} */}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Station ID
                    </TableCell>
                    {/* {Array.isArray(meterStatistics) &&
        meterStatistics?.map((count, index) => (
          <TableCell key={index} sx={{ color: "#111" }}>
            {count?.["Total meters"]}
          </TableCell>
        ))} */}
                  </TableRow>
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Grid>
          <Grid container item xs={12} md={6} sx={{padding:" 0px 30px"}}>
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
