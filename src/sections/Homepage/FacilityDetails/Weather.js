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
  Checkbox,
  Link,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { PowerBIEmbed } from "powerbi-client-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { commonDocumentFileUploadAction, documentFileUploadAction } from "../../../redux/global/actions/fileUploadAction";
import { WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS, adminHourlyEndPoints, hourlyEndPoints } from "constants/apiEndPoints";
import NotificationsToast from "utils/notification/NotificationsToast";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import axiosInstance from "utils/interceptor";
import MapComponent from "components/MapComponent/MapComponent";
import Loader from "pages/Loader";
import ViewEntryDetailListModal from "./EntryListing/ViewEntryDetailListModal";
import DeleteEntriesModal from "./EntryListing/DeleteEntriesModal";
const Weather = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);
  const [independentVarsList, setIndependentVarList] = useState([]);
  const [weatherStations, setWeatherStations] = useState([]);
  const dispatch = useDispatch();
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false);

  const weatherDataSetId = process.env.REACT_APP_POWERBI_WEATHER_DATASET_ID;
  const weatherReportId = process.env.REACT_APP_POWERBI_WEATHER_REPORT_ID;
  const weatherEmbedUrl = process.env.REACT_APP_POWERBI_WEATHER_EMBED_URL;
  const iVDataSetId = process.env.REACT_APP_POWERBI_IV_DATASET_ID;
  const iVReportId = process.env.REACT_APP_POWERBI_IV_REPORT_ID;
  const iVEmbedUrl = process.env.REACT_APP_POWERBI_IV_EMBED_URL;
  const [reportLoading, setReportLoading] = useState(true);
  const [loadingState, setLoadingState] = useState(false);
  const [tabValue, setTabValue] = useState("weather");
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [independentVariable1File, setIndependentVariable1File] =
    useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const initialValues = {};
  const [progress, setProgress] = useState(0);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const selectedIv =
    independentVarsList?.length &&
    independentVarsList.find((obj) => obj["id"] == tabValue);
  const selectedIvName = selectedIv ? selectedIv["name"] : undefined;
  const [weatherData, setWeatherData] = useState({});
  const [weatherParamsChecked, setWeatherParamChecked] = useState({
    temp: true,
    rel_hum: true,
    precip_amount: true,
    wind_spd: true,
    station_press: true,
  });

  const [imgUploadData, setImgUploadData] = useState("");
  const [meterRawData, setMeterRowData] = useState([]);
  const [uploadDataFormVisible, setUploadDataFormVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const getDataProcessingLoader =  sessionStorage?.getItem("dataProcessingLoader") === 'true'
const [dataProcessingLoader, setDataProcessingLoader] = useState(getDataProcessingLoader || false);
const [refreshPageData, setRefreshPageData] = useState(0)

  useEffect(() => {
    setIndependentVariable1File(null);
    if (!(tabValue == "weather") && selectedIv?.files?.[0]?.file_path) {
      getPowerBiTokenForIV();
    }
  }, [selectedIvName]);

  useEffect(() => {
    if (!facilityData) return;
    if (tabValue == "weather") {
      getWeatherData();
    }
  }, [facilityData, selectedIvName]);

  const getWeatherData = async () => {
    try {
      setWeatherLoading(true);
      const response = await GET_REQUEST(
        WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.GET_WEATHER_DATA +
          `?facility_id=${facilityData?.id}`
      );

      const weatherData = response.data;

      const shortMonthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Format the data for all charts
      const formattedData = {
        temp: [],
        rel_hum: [],
        precip_amount: [],
        wind_spd: [],
        station_press: [],
      };

      weatherData.forEach((item) => {
        const shortMonthName = shortMonthNames[item.month - 1];
        const commonData = {
          name: `${shortMonthName} ${item.year}`,
          month: item.month,
          year: item.year,
        };

        formattedData.temp.push({
          ...commonData,
          value: parseFloat(item.temperature),
        });
        formattedData.rel_hum.push({
          ...commonData,
          value: parseFloat(item.average_humidity),
        });
        formattedData.precip_amount.push({
          ...commonData,
          value: parseFloat(item.average_precipitation),
        });
        formattedData.wind_spd.push({
          ...commonData,
          value: parseFloat(item.average_wind_speed),
        });
        formattedData.station_press.push({
          ...commonData,
          value: parseFloat(item.average_station_pressure),
        });
      });

      setWeatherData(formattedData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getPowerBiTokenForIV = () => {
    const apiURL = POWERBI_ENDPOINTS.GET_AZURE_TOKEN_FOR_POWER_BI;

    GET_REQUEST(apiURL)
      .then((response) => {
        localStorage.setItem(
          "powerBiAccessToken",
          response?.data?.access_token
        );
        getPowerBiReportTokenForIV();
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status == 403) {
        }
        setReportLoading(false);
      });
  };

  const getPowerBiReportTokenForIV = () => {
    setReportLoading(true);
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const body = {
      datasets: [
        {
          id: iVDataSetId,
        },
      ],
      reports: [
        {
          allowEdit: true,
          id: iVReportId,
        },
      ],
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        localStorage.setItem("powerBiReportToken", JSON.stringify(res?.data));
        setReportParametersForIV();
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.status == 403) {
        }
        setReportLoading(false);
      });
  };

  let powerBiReportToken = localStorage.getItem("powerBiReportToken")
    ? JSON.parse(localStorage.getItem("powerBiReportToken"))
    : null;

  const setReportParametersForIV = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${iVDataSetId}/Default.UpdateParameters`;
    const body = {
      updateDetails: [
        {
          name: "variable_id",
          newValue: selectedIv?.id,
        },
      ],
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        refreshPowerBiReportForIV();
      })
      .catch((error) => {
        setReportLoading(false);
        console.log(error);
      });
  };

  const refreshPowerBiReportForIV = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${iVDataSetId}/refreshes`;
    const body = {
      retryCount: 3,
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        setReportLoading(false);
      })
      .catch((error) => {
        setReportLoading(false);
        console.log(error);
      });
  };

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

  const [viewEntriesModalConfig, setViewEntriesModalConfig] = useState({
    ...modalConfig,
    modalUI: {
      ...modalConfig.modalUI,
      showHeader: false,
      modalBodyContentStyle: ""

    },

  })

  const [deleteEntriesModalConfig, setDeleteEntriesModalConfig] = useState({
    ...modalConfig,
    modalUI: {
      ...modalConfig.modalUI,
      showHeader: false,
      modalBodyContentStyle: ""

    },

  })

  const openRequestModal = (isEdit, data) => {
    setModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      modalBodyContent: (
        <AddEditIndependentVariable isEdit={isEdit} data={data} />
      ),
    }));
  };

  useEffect(() => {
    getIndependentVariales();
    getWeatherStations();
  }, [facilityData?.id]);

  const getIndependentVariales = () => {
    const apiURL =
      WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.GET_INDEPENDENT_VARIABLE +
      `/${facilityData?.id}`;
    GET_REQUEST(apiURL).then((response) => {
      if (response?.data?.length) {
        setIndependentVarList([...response?.data]);
      }
    });
  };

  const getWeatherStations = () => {
    const apiURL =
      WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.GET_WEATHER_STATION +
      `?facility_id=${facilityData?.id}`;
    GET_REQUEST(apiURL).then((response) => {
      if (response?.data?.length) {
        setWeatherStations([...response?.data]);
      }
    });
  };

  const AddEditIndependentVariable = ({ isEdit, data }) => {
    const formSubmit = (data) => {
      setLoadingState(true);
      const apiURL =
        WEATHER_INDEPENDENT_VARIABLE_ENDPOINTS.ADD_INDEPENDENT_VARIABLE;
      const body = { ...data, facility_id: facilityData?.id };
      POST_REQUEST(apiURL, body)
        .then((response) => {
          setTabValue(response?.data?.data?.id);
          setLoadingState(false);
          getIndependentVariales();
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          NotificationsToast({
            message: "Independent variable created successfully",
            type: "success",
          });
        })
        .catch((error) => {
          setLoadingState(false);
          setModalConfig((prevState) => ({
            ...prevState,
            modalVisible: false,
          }));
          NotificationsToast({
            message: "Something went wrong, please contact the admin.",
            type: "error",
          });
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
                  type="text"
                />
              </Stack>

              <Stack sx={{ marginBottom: "1rem" }}>
                <InputField
                  name="description"
                  label="Independent Variable Description"
                  type="text"
                />
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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setUploadDataFormVisible(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {

    setUploadProgress(0) // reset before upload progress
    setIsUploading(true)
    const selectedFile = event.target.files[0];
    setIndependentVariable1File(selectedFile);
    const apiURL = hourlyEndPoints.ADD_BULK_HOURLY_DATA;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("iv", true);
    formData.append("facility_id", facilityData?.id);
    formData.append("meter_id", selectedIv?.id );

    // console.log(apiURL, formData, selectedIv, "check data")

    // return

    dispatch(commonDocumentFileUploadAction(apiURL, formData, (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      
      setUploadProgress(progress < 100 ? progress : 99); // wait until upload progress is confirmed
    }))
       .then((data) => {

        if(data?.message === undefined || data === undefined) {
          setIndependentVariable1File(null)
        }
        setImgUploadData(data);
        setIsUploading(false)
        setUploadProgress(100); // when the upload is confirmed
       })
       .catch((error) => {
         console.error("Error uploading document:", error);
         setIsUploading(false);
       });
  };
  

  

  const uploadIndepentVariableFile = (data) => {
    
    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    const apiURL = hourlyEndPoints.ADD_HOURLY_METER_DATA;
    const payload = {
      "facility_id": facilityData?.id,
      "record_id": data.record_id
  }

  console.log(apiURL,payload, "checking payload")
    // return;
    POST_REQUEST(apiURL, payload)
      .then((response) => {
        // getHourlySubHourlyEntryData();
        // dispatch(fetchFacilityStatus(id));
        // dispatch(fetchFacilityDetails(id));
      
        NotificationsToast({
          message: response.data.status,
          type: "success",
        });
        // reset
        setIndependentVariable1File(null);
        setImgUploadData("")
        setUploadDataFormVisible(false);
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });

         // Start polling for data
         startPollingForData(setDataProcessingLoader, getHourlyEntriesData);

      })
      .catch((error) => {
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        NotificationsToast({
          message: error?.message ? error.message : "Something went wrong!",
          type: "error",
        });
      });
   
  };

   // Polling GET API to retrieve the data
   const startPollingForData = (setDataProcessingLoader, getHourlyEntriesData) => {
    // Start data processing loader
    setDataProcessingLoader(true);
    sessionStorage.setItem("dataProcessingLoader", JSON.stringify(true));

    const checkInterval = setInterval(async () => {
      try {
        const response = await getHourlyEntriesData("processingLoader");
        if (response.data?.data?.rows?.length > 0) {
          // Data is retrieved successfully, stop polling
          setDataProcessingLoader(false);
          sessionStorage.removeItem("dataProcessingLoader");
          clearInterval(checkInterval);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 3000); // Poll every 3 seconds
  
    return checkInterval;
  };


  const getHourlyEntriesData = async (loader) => {
    console.log(loader, "checking loaders...");
    if(loader === "processingLoader"){
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
    }else {
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    }

    let apiURL = `${adminHourlyEndPoints.GET_HOURLY_ENTRIES}`;
    let payload = {
      "facility_id": facilityData?.id,
      "limit": 10,
      "offset": 0,
      "independent_variable_id": selectedIv?.id,
    }
  
    try {
      const res = await POST_REQUEST(apiURL, payload);
      console.log(res, "check view entry list");
      if (res.data?.data?.rows instanceof Array && res.data?.data?.rows.length > 0) {
        setMeterRowData(res.data?.data?.rows);
        setUploadDataFormVisible(false);
      }

      if(loader !== "processingLoader" && res.data?.data?.rows.length === 0) {
        setMeterRowData(res.data?.data?.rows);
        setUploadDataFormVisible(true);
      }

    

      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      return res;  // Return the response for polling check
    } catch (error) {
      console.log(error);
      dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      throw error;  // Throw the error to be caught in polling
    }
  }

  const deleteFile = (imgData) => {

    dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: true });
    const apiURL = hourlyEndPoints.DELETE_HOURLY_ENTRIES_FILE;
    const payload = {
      record_id: imgData?.record_id,
      iv: false,  // for hourly data independent variable will be false...
    };

    console.log(imgData, apiURL, payload, "checking upload data")
    // return;
    POST_REQUEST(apiURL, payload)
      .then((response) => {
        setImgUploadData("")
        setIndependentVariable1File(null)
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
        // if (response.data.statusCode == 200) {
        //   setHourlyEntryFile(null);
        //   getHourlySubHourlyEntryData();
        // }
      })
      .catch((error) => { 
        console.log(error)
        dispatch({ type: "SHOW_EV_PAGE_LOADER", payload: false });
      });
  };

  const handleCheckboxChange = (event) => {
    setWeatherParamChecked((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleViewEntries = () => {

    setViewEntriesModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "",
      headerSubText: "",
      modalBodyContent: (
        <ViewEntryDetailListModal
          meterId=""
          meterType=""
          facilityId={facilityData?.id}
          independentVariableId = {selectedIv?.id}
          // selectedIv
        />
      ),
    }));

  }

  const handleDeleteEntries = () => {
    setDeleteEntriesModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: "",
      headerSubText: "",
      modalBodyContent: (
        <DeleteEntriesModal
        meterId=""
        meterType=""
        facilityId={facilityData?.id}
        independentVariableId = {selectedIv?.id}
        setModalConfig={setDeleteEntriesModalConfig}
          setRefreshPageData={setRefreshPageData}
        />
      ),
    }));
  }


  const getPowerBiError = (errorDetail) => {
    console.log("Error in setIsErrorInPowerBi", errorDetail);
  };

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
  };

  const WeatherCharts = (variable) => {
    const getVariableFullName = (name) => {
      const nameMap = {
        temp: "Temperature",
        rel_hum: "Relative Humidity",
        precip_amount: "Precipitation Amount",
        wind_spd: "Wind Speed",
        station_press: "Atmospheric Pressure",
      };

      return nameMap[name] || name;
    };

    let data = weatherData[variable];

    const smallFontStyle = {
      fontSize: "12px",
    };

    const customTooltipStyle = {
      backgroundColor: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      ...smallFontStyle,
    };

    return (
      <div
        style={{ width: "100%", height: 300, marginLeft: "-2.25rem" }}
        className="weather-charts"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" horizontal={false} />
            <XAxis
              dataKey="name"
              style={smallFontStyle}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={50}
              interval={0}
            />
            <YAxis style={smallFontStyle} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={customTooltipStyle}
              labelStyle={smallFontStyle}
              formatter={(value, name, props) => [
                value,
                getVariableFullName(variable),
              ]}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#A2E00A"
              name={getVariableFullName(variable)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };


  useEffect(() => {

    if(Object.keys(facilityData).length > 0 && !dataProcessingLoader && selectedIv){
      console.log(facilityData, "facilityData check")
      getHourlyEntriesData()
    }

    if (Object.keys(facilityData).length > 0 && dataProcessingLoader && selectedIv) {
      startPollingForData(setDataProcessingLoader, getHourlyEntriesData);
    }

  }, [facilityData,selectedIv, refreshPageData]);


  console.log(weatherData, "weatherData")
  return (
    <>
      <Box
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
            maxWidth: "100%",
          }}
        >
          <Grid item xs={12} md={8}>
            <Tabs
              className="theme-tabs-list"
              value={tabValue}
              onChange={handleChange}
              sx={{ display: "inline-flex", maxWidth: "100%" }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                value="weather"
                label="Weather"
                sx={{ minWidth: "10rem", maxWidth: "10rem" }}
              />
              {independentVarsList?.length
                ? independentVarsList.map((item, i) => {
                    return (
                      <Tab
                        key={item?.id}
                        value={item?.id}
                        label={item?.name}
                        sx={{ minWidth: "10rem", maxWidth: "10rem" }}
                      />
                    );
                  })
                : null}
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
              onClick={() => openRequestModal(false)}
            >
              Add Independent Variable
            </Button>
          </Grid>
        </Grid>

        {tabValue === "weather" ? (
          <Box>
            {/* <Grid container mb="2.5rem">
                <Grid item xs={12}>
                   <iframe style={{width: '100%', minHeight: ' 100vh', border: '1px solid #ccc'}} src={`http://172.183.115.159:5005/graph?variable_id=${selectedIv?.id}`}></iframe>
                </Grid>
            </Grid> */}

            <Grid container  mb="2.5rem">
              <Grid item xs={12}>
                  {
                    <MapComponent
                      facilityData={facilityData}
                      weatherStations={weatherStations}
                    />
                  }
              </Grid>
             
            </Grid>
            <Grid
              container
              xs={12}
              mb="2.5rem"
              alignItems="flex-start"
            >
              {weatherStations?.length ? (
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
                          <TableCell
                            sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}
                          ></TableCell>
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
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}
                          >
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
                        <TableRow>
                          <TableCell
                            sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}
                          >
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
                          <TableCell
                            sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}
                          >
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
                          <TableCell
                            sx={{ bgcolor: "#2E813E60", fontStyle: "italic" }}
                          >
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
                </Grid>
              ) : null}
                  {Object.keys(weatherData)?.length > 0 && 
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
                                    name="temp"
                                    type="checkbox"
                                    as={Checkbox}
                                    checked={weatherParamsChecked?.temp}
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
                                    name="rel_hum"
                                    type="checkbox"
                                    as={Checkbox}
                                    checked={weatherParamsChecked?.rel_hum}
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
                                    name="precip_amount"
                                    type="checkbox"
                                    as={Checkbox}
                                    checked={weatherParamsChecked?.precip_amount}
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
                                    name="station_press"
                                    type="checkbox"
                                    as={Checkbox}
                                    checked={weatherParamsChecked?.station_press}
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
                                    name="wind_spd"
                                    type="checkbox"
                                    as={Checkbox}
                                    checked={weatherParamsChecked?.wind_spd}
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
                            {/* <FormGroup>
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
                        </FormGroup> */}
                          </Form>
                        </Formik>
                      </Grid>
                    </Grid>
                  }
              </Grid>

                <Grid container>
                  {((weatherParamsChecked?.temp && !weatherLoading) && weatherData?.temp?.length > 0) ? (
                    <Grid item xs={12} style={{ marginBottom: "2.5rem" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem!important",
                          fontWeight: "600",
                          marginBottom: "1rem",
                        }}
                      >
                        Air temperature
                      </Typography>
                      {WeatherCharts("temp")}
                    </Grid>
                  ) : null}

                  {((weatherParamsChecked?.rel_hum && !weatherLoading) && weatherData?.rel_hum?.length > 0) ? (
                    <Grid item xs={12} style={{ marginBottom: "2.5rem" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem!important",
                          fontWeight: "600",
                          marginBottom: "1rem",
                        }}
                      >
                        Relative humidity
                      </Typography>
                      {WeatherCharts("rel_hum")}
                    </Grid>
                  ) : null}

                  {((weatherParamsChecked?.precip_amount && !weatherLoading) && weatherData?.precip_amount?.length > 0) ? (
                    <Grid item xs={12} style={{ marginBottom: "2.5rem" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem!important",
                          fontWeight: "600",
                          marginBottom: "1rem",
                        }}
                      >
                        Precipitation
                      </Typography>
                      {WeatherCharts("precip_amount")}
                    </Grid>
                  ) : null}

                  {((weatherParamsChecked?.wind_spd && !weatherLoading) && weatherData?.wind_spd?.length > 0) ? (
                    <Grid item xs={12} style={{ marginBottom: "2.5rem" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem!important",
                          fontWeight: "600",
                          marginBottom: "1rem",
                        }}
                      >
                        Wind speed
                      </Typography>
                      {WeatherCharts("wind_spd")}
                    </Grid>
                  ) : null}

                  {((weatherParamsChecked?.station_press && !weatherLoading ) && weatherData?.station_press?.length > 0)? (
                    <Grid item xs={12} style={{ marginBottom: "2.5rem" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "1.125rem!important",
                          fontWeight: "600",
                          marginBottom: "1rem",
                        }}
                      >
                        Atmospheric pressure
                      </Typography>
                      {WeatherCharts("station_press")}
                    </Grid>
                  ) : null}

                </Grid>
            
              
            
          </Box>
        ) : 
        <React.Fragment>
          {
            (selectedIv?.files?.[0]?.file_path) &&
              <Box>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" gap="0.75rem">
                <Link underline="hover" variant="body2" sx={{ color: '#56B2AE', cursor: "pointer" }} 
                onClick={() => handleViewEntries()} 
                >
                  View entries
                </Link>
                <Link underline="hover" variant="body2" sx={{ color: 'danger.main', cursor: "pointer" }} 
                onClick={() => handleDeleteEntries()} 
                >
                  Delete entries
                </Link>
                <Link underline="hover" variant="body2" sx={{ color: 'primary.main', cursor: "pointer" }} 
                onClick={() => setUploadDataFormVisible(true)} 
                
                >
                  <IconButton>
                    <AddCircleIcon
                      sx={{
                        color: "text.primary",
                        fontSize: "1.875rem",
                      }}
                    />
                  </IconButton>
                  Add entries
                </Link>
              </Stack>
             </Box>
          }
          {
           
            (uploadDataFormVisible || !selectedIv?.files?.[0]?.file_path) &&
              <Box sx={{marginBottom: '1.5rem'}}>
                  <Typography variant="h5">
                    Upload data in bulk for {selectedIvName}
                  </Typography>
                  <Typography variant="small2" gutterBottom>
                    Upload the excel file, and refer to spreadsheet for the formatting
                    details.
                  </Typography>
                    <Box>
                  {isUploading ? (
                          <>
                              <Box sx={{mt: 4, width: {xs: "100%", md: "50%"}, maxWidth: '350px' }}>
                                  <LinearProgress variant="determinate" value={uploadProgress} />
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                      <Typography variant="body2" color="textSecondary">
                                          {independentVariable1File?.name} Uploading..
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary">
                                          {uploadProgress}%
                                      </Typography>
                                  </Box>
                              </Box>
                              {/* <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => setIsUploading(false)}
                                  sx={{ mt: 2 }}
                              >
                                  Cancel
                              </Button> */}
                          </>
                    ) : (
                      <React.Fragment>
                        {imgUploadData?.record_id ? 
                              <Box sx={{marginTop: '1.5rem'}}>
                              <Typography
                                variant="body2"
                                sx={{ color: "blue.main", display: "inline-block" }}
                              >
                                {independentVariable1File?.name}

                              </Typography>

                              <Typography
                                variant="body2"
                                  sx={{ color: "danger.main",display: "inline-block", marginLeft: "1rem", cursor: "pointer" }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteFile(imgUploadData);
                                  }}
                                >
                                  Delete
                                </Typography>
                                {imgUploadData?.error && 
                                  <Stack direction="row" sx={{ marginTop: '1rem'}}>
                                  <Typography
                                    variant="small"
                                    sx={{ color: "danger.main", }}
                                  
                                  >
                                    {imgUploadData?.error}
                                  </Typography>
                                  </Stack>
                              }
                              </Box>
                        :   
                        <Box >
                            <Typography
                              sx={{
                                color: "#2E813E",
                                fontWeight: "500",
                                fontSize: "18px",
                                backgroundColor: "#D1FFDA",
                                padding: "7px 33px",
                                borderRadius: "8px",
                                height: "40px",
                                marginTop: "1.25rem",
                                cursor: "pointer",
                                maxWidth: "fit-content",
                                
                              }}
                              onClick={handleButtonClick}
                            >
                              {independentVariable1File
                                ? independentVariable1File?.name
                                : "Choose File"}
                            </Typography>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                              accept=".xlsx,.csv"
                            />
                              {imgUploadData?.error && 
                              <Stack direction="row" sx={{ marginTop: '0.5rem'}}>
                                <Typography
                                  variant="small"
                                  sx={{ color: "danger.main", }}
                                
                                >
                                  {imgUploadData?.error}
                                </Typography>
                              </Stack>
                              }
                        </Box>
                      }
                        
                      </React.Fragment>

                    ) 
                    
                    }

                    </Box>

                    <Box sx={{marginTop:'1rem'}}>
                      <Button
                          variant="contained"
                          onClick={() => uploadIndepentVariableFile(imgUploadData)}
                          style={{
                            padding: "0.2rem 1rem",
                            minWidth: "unset",
                            width: "165px",
                            height: "40px",
                            marginTop: '0.5rem'
                          }}
                          disabled={!independentVariable1File || isUploading || imgUploadData?.error}
                        >
                          Upload
                        </Button>
                  </Box>
            </Box>
          }

        {(dataProcessingLoader) && 
            <Box sx={{ display: "flex", gap: '1rem', alignItems: 'center'}}>
              <Typography variant="body2" color="textSecondary" sx={{marginRight: '1rem'}} >
                Be patience, file processing is running
            </Typography>
            <div class="progress-loader"></div>
            
            </Box>
          }

          {

            selectedIv?.files?.[0]?.file_path ? (
              <Grid sx={{ width: "100%" }}>
                <Grid sx={{ width: "100%" }}>
                  <Box id="bi-report" mt={4}>
                    {!isErrorInPowerBi && !reportLoading ? (
                      <PowerBIEmbed
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
                                console.log("iiiiiiiiiii", event.detail);
                                getPowerBiError(event.detail);
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
                      />
                    ) : (
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
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            ) : (
              null
              
            ) 
          }
        </React.Fragment>
        
        // else part ended
        
        }
      </Box>
      <EvModal modalConfig={modalConfig} setModalConfig={setModalConfig} />
      {viewEntriesModalConfig.modalVisible &&
        <EvModal
          modalConfig={viewEntriesModalConfig}
          setModalConfig={setViewEntriesModalConfig}
        />
      }

      {deleteEntriesModalConfig.modalVisible &&
        <EvModal
          modalConfig={deleteEntriesModalConfig}
          setModalConfig={setDeleteEntriesModalConfig}
        />
      }
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loadingState}
        loaderPosition="fixed"
      />
    </>
  );
};

export default Weather;
