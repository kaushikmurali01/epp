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
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
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
import NotificationsToast from "utils/notification/NotificationsToast";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import axiosInstance from "utils/interceptor";
import MapComponent from "components/MapComponent/MapComponent";
const Weather = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);
  const [independentVarsList, setIndependentVarList] = useState([]);
  const [weatherStations, setWeatherStations] = useState([]);
  const dispatch = useDispatch();
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false)

  const weatherDataSetId = process.env.REACT_APP_POWERBI_WEATHER_DATASET_ID
  const weatherReportId = process.env.REACT_APP_POWERBI_WEATHER_REPORT_ID
  const weatherEmbedUrl = process.env.REACT_APP_POWERBI_WEATHER_EMBED_URL
  const iVDataSetId = process.env.REACT_APP_POWERBI_IV_DATASET_ID
  const iVReportId = process.env.REACT_APP_POWERBI_IV_REPORT_ID
  const iVEmbedUrl = process.env.REACT_APP_POWERBI_IV_EMBED_URL
  const [reportLoading, setReportLoading] = useState(true)
  const [tabValue, setTabValue] = useState("weather");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [independentVariable1File, setIndependentVariable1File] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [checked, setChecked] = useState(true);
  const initialValues = {};
  const [progress, setProgress] = useState(0);
  const LAT_LONG_DATA = [
    {
      station_name: "Toronto city centre weather station",
      latitude: 43.644,
      longitude: -79.403,
      climate_id: "",
      station_id: ""
    },
    {
      station_name: "Toronto city weather station",
      latitude: 43.67,
      longitude: -79.4,
      climate_id: "6158355",
      station_id: "31688"
    },
    {
      station_name: "Toronto INTL A weather station",
      latitude: 43.67,
      longitude: -79.4,
      climate_id: "6158731",
      station_id: "51459"
    }
  ];

  const selectedIv= independentVarsList?.length && independentVarsList.find(obj => obj['id'] == tabValue);
  const selectedIvName = selectedIv ? selectedIv['name'] : undefined;

  useEffect(() => {
    setIndependentVariable1File(null)
    if(!(tabValue == 'weather') && (selectedIv?.files?.[0]?.file_path)){
       getPowerBiTokenForIV()
    }
  }, [selectedIvName]);

  useEffect(() => {
    if(!facilityData) return;
    if(tabValue == 'weather'){
      getPowerBiTokenForWeather()
    }
  }, [facilityData, selectedIvName])

  const getPowerBiTokenForWeather = () => {
    const apiURL = POWERBI_ENDPOINTS.GET_AZURE_TOKEN_FOR_POWER_BI

    GET_REQUEST(apiURL).then((response) => {
      localStorage.setItem("powerBiAccessToken", (response?.data?.access_token));
      getPowerBiReportTokenForWeather()
    })
    .catch((error) => {
      console.log(error);
      if(error?.response?.status == 403){
      }
      setReportLoading(false);
    });
  }

  const getPowerBiReportTokenForWeather= () => {
    setReportLoading(true)
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const body = {
      "datasets": [
        {
          "id": weatherDataSetId
        }
      ],
      "reports": [
        {
          "allowEdit": true,
          "id": weatherReportId
        }
      ]
    }
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        localStorage.setItem("powerBiReportToken", JSON.stringify(res?.data))
        setReportParametersForWeather();
      })
      .catch((error) => {
        console.log(error);
        if(error?.response?.status == 403){
        }
        setReportLoading(false);
      });
  }

  const setReportParametersForWeather = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${weatherDataSetId}/Default.UpdateParameters`
    const body = {
      "updateDetails": [
        {
          "name": "facility_id",
          "newValue": facilityData?.id
        },
      ]
    }
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        refreshPowerBiReportForWeather()
      })
      .catch((error) => {
        setReportLoading(false)
        console.log(error);
      });
  }

  const refreshPowerBiReportForWeather = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${weatherDataSetId}/refreshes`
    const body = {
      retryCount: 3
    }
    POWERBI_POST_REQUEST(apiURL, body, )
      .then((res) => {
        setReportLoading(false)
      })
      .catch((error) => {
        setReportLoading(false)
        console.log(error);
      });
  }

  const getPowerBiTokenForIV = () => {
    const apiURL = POWERBI_ENDPOINTS.GET_AZURE_TOKEN_FOR_POWER_BI

    GET_REQUEST(apiURL).then((response) => {
      localStorage.setItem("powerBiAccessToken", (response?.data?.access_token));
      getPowerBiReportTokenForIV()
    })
    .catch((error) => {
      console.log(error);
      if(error?.response?.status == 403){
      }
      setReportLoading(false);
    });
  }

  const getPowerBiReportTokenForIV= () => {
    setReportLoading(true)
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const body = {
      "datasets": [
        {
          "id":iVDataSetId
        }
      ],
      "reports": [
        {
          "allowEdit": true,
          "id":iVReportId
        }
      ]
    }
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        localStorage.setItem("powerBiReportToken", JSON.stringify(res?.data))
        setReportParametersForIV();
      })
      .catch((error) => {
        console.log(error);
        if(error?.response?.status == 403){
        }
        setReportLoading(false);
      });
  }

  let powerBiReportToken = localStorage.getItem("powerBiReportToken") ? JSON.parse(localStorage.getItem("powerBiReportToken")) : null;

  const setReportParametersForIV = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${iVDataSetId}/Default.UpdateParameters`
    const body = {
      "updateDetails": [
        {
          "name": "variable_id",
          "newValue": selectedIv?.id
        },
      ]
    }
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        refreshPowerBiReportForIV()
      })
      .catch((error) => {
        setReportLoading(false)
        console.log(error);
      });
  }

  const refreshPowerBiReportForIV = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${iVDataSetId}/refreshes`
    const body = {
      retryCount: 3
    }
    POWERBI_POST_REQUEST(apiURL, body, )
      .then((res) => {
        setReportLoading(false)
      })
      .catch((error) => {
        setReportLoading(false)
        console.log(error);
      });
  }

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
    headerText: "Add independent variable",
    headerSubText:
      "Please enter the following details to add a new independent variable for this meter",
    modalBodyContent: "",
  });

  const openRequestModal = (isEdit, data) => {
      setModalConfig((prevState) => ({
        ...prevState,
        modalVisible: true,
        modalBodyContent: <AddEditIndependentVariable isEdit={isEdit} data={data} />,
      }));
  };

  useEffect(() => {
    getIndependentVariales();
    getWeatherStations();

  }, facilityData?.id)

  const getIndependentVariales = () => {
    const apiURL = WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.GET_INDEPENDENT_VARIABLE+`/${facilityData?.id}`;
    GET_REQUEST(apiURL).then((response) => {
      if(response?.data?.length){
        setIndependentVarList([...(response?.data)])
      }
    });
  }
  
  const getWeatherStations = () => {
    const apiURL = WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.GET_WEATHER_STATION+`?facility_id=${facilityData?.id}`;
    GET_REQUEST(apiURL).then((response) => {
      if(response?.data?.length){
        setWeatherStations([...(response?.data)])
      }
    });
  }

  const AddEditIndependentVariable = ({ isEdit, data }) => {
    const formSubmit = (data) => {
      const apiURL = WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.ADD_INDEPENDENT_VARIABLE;
      const body = {...data, facility_id: facilityData?.id};
      POST_REQUEST(apiURL, body).then((response) => {
        setTabValue(response?.data?.data?.id);
        getIndependentVariales();
        setModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
        }));
        NotificationsToast({ message: "Independent variable created successfully", type: "success" });
      }).catch((error) => {
        setModalConfig((prevState) => ({
          ...prevState,
          modalVisible: false,
        }));
        NotificationsToast({ message: "Something went wrong, please contact the admin.", type: "error" });
      })
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
    setIndependentVariable1File(selectedFile);
  };

  const uploadIndepentVariableFile = () => {
    const apiURL = WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.UPLOAD_INDEPENDENT_VARIABLE_FILE+`/${tabValue}`;
    const body = new FormData();
    body.append("file", independentVariable1File);
    axiosInstance.post(apiURL, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
    })
    .then((response) => {
      if(response){
        setIsFileUploaded(true);
        getIndependentVariales();
        NotificationsToast({ message: "Independent variable file uploaded successfully", type: "success" });
      }
    })
    .catch((error) => {
      console.error('There was an error uploading the file!', error);
      NotificationsToast({ message: "Something went wrong, please contact the admin.", type: "error" });
    });
  }

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

  const getPowerBiError = (errorDetail) => {
    console.log('Error in setIsErrorInPowerBi',errorDetail)
  }
 
  let powerBiConfig = {
    type: "report",
    id: tabValue == "weather" ? weatherReportId : iVReportId,
    embedUrl: tabValue == "weather" ? weatherEmbedUrl : iVEmbedUrl, 
    accessToken: powerBiReportToken?.token || null,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: false, // Hide the filter pane
        },
        pageNavigation: {
          visible: false, // Hide the page navigation
        },
      },
      background: models.BackgroundType.Transparent,
    },
  }

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
          maxWidth: "80%"
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
                key={item?.id}
                value={item?.id}
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
        <Grid xs={8} md={10}>
        <MapComponent />
        </Grid>
        <Grid
          container
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1rem",
            marginBottom: "3rem",
          }}
          xs={12} md={10}
        >
          {weatherStations?.length ? <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
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
                    {Array.isArray(weatherStations) &&
                      weatherStations?.map((type, index) => (
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
                    {Array.isArray(weatherStations) &&
                      weatherStations?.map((type, index) => (
                        <TableCell
                          key={type.meterType}
                          sx={{ color: "#111", fontStyle: "italic" }}
                        >
                          {type?.["latitude"]}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Longitude
                    </TableCell>
                    {Array.isArray(weatherStations) &&
                      weatherStations?.map((count, index) => (
                        <TableCell key={index} sx={{ color: "#111" }}>
                          {count?.["longitude"]}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Climate ID
                    </TableCell>
                    {Array.isArray(weatherStations) &&
                      weatherStations?.map((count, index) => (
                        <TableCell key={index} sx={{ color: "#111" }}>
                          {count?.["climate_id"]}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}>
                      Station ID
                    </TableCell>
                    {Array.isArray(weatherStations) &&
                      weatherStations?.map((count, index) => (
                        <TableCell key={index} sx={{ color: "#111" }}>
                          {count?.["station_id"]}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </MuiTable>
            </TableContainer>
          </Grid> : null}
          {/* <Grid container item xs={12} md={5} sx={{ padding: " 0px 17px" }}>
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
          </Grid> */}
          <Grid sx={{width: "100%"}}>
            <Grid sx={{width: "100%"}}>
              <Box id="bi-report" mt={4}>
                {((!isErrorInPowerBi && !reportLoading)) ? <PowerBIEmbed
                  embedConfig={powerBiConfig}
                  eventHandlers={
                    new Map([
                      [
                        "loaded",
                        function () {
                          console.log("Report loaded");
                        },
                      ],
                      [
                        "rendered",
                        function () {
                          console.log("Report rendered");
                        },
                      ],
                      [
                        "error",
                        function (event) {
                          console.log("iiiiiiiiiii",event.detail);
                          getPowerBiError(event.detail)
                        },
                      ],
                      ["visualClicked", () => console.log("visual clicked")],
                      ["pageChanged", (event) => console.log(event)],
                    ])
                  }
                  cssClassName={"bi-embedded"}
                  getEmbeddedComponent={(embeddedReport) => {
                    window.report = embeddedReport;
                  }}
                /> : 
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "700",
                    fontSize: "1.125rem !important",
                    lineHeight: "106.815%",
                    letterSpacing: "-0.01125rem",
                  }}
                >
                  Verifying data and creating visualization, please wait...
                </Typography>}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box> : (
        (selectedIv?.files?.[0]?.file_path) ? 
        <Grid sx={{width: "100%"}}>
          <Grid sx={{width: "100%"}}>
            <Box id="bi-report" mt={4}>
              {((!isErrorInPowerBi && !reportLoading)) ? <PowerBIEmbed
                embedConfig={powerBiConfig}
                eventHandlers={
                  new Map([
                    [
                      "loaded",
                      function () {
                        console.log("Report loaded");
                      },
                    ],
                    [
                      "rendered",
                      function () {
                        console.log("Report rendered");
                      },
                    ],
                    [
                      "error",
                      function (event) {
                        console.log("iiiiiiiiiii",event.detail);
                        getPowerBiError(event.detail)
                      },
                    ],
                    ["visualClicked", () => console.log("visual clicked")],
                    ["pageChanged", (event) => console.log(event)],
                  ])
                }
                cssClassName={"bi-embedded"}
                getEmbeddedComponent={(embeddedReport) => {
                  window.report = embeddedReport;
                }}
              /> : 
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "700",
                  fontSize: "1.125rem !important",
                  lineHeight: "106.815%",
                  letterSpacing: "-0.01125rem",
                }}
              >
                Verifying data and creating visualization, please wait...
              </Typography>}
            </Box>
          </Grid>
        </Grid>
        :
        <Box>
          <Typography variant="h5">
            Upload data in bulk for {selectedIvName}
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
            onClick={() => uploadIndepentVariableFile()}
            style={{
              padding: "0.2rem 1rem",
              minWidth: "unset",
              width: "165px",
              height: "40px",
            }}
            disabled={!independentVariable1File}
          >
            Upload
          </Button>
        </Box>
      )}

    </Box>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
    </>
  );
};

export default Weather;
