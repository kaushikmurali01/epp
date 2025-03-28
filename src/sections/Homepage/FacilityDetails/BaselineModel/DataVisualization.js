import { Box, Button, Grid, Typography } from "@mui/material";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { GET_REQUEST } from "utils/HTTPRequests";
import { BASELINE_ENDPOINTS, POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import {
  activeButtonStyle,
  inactiveButtonStyle,
  StyledButtonGroup,
} from "./styles";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const DataVisualization = ({ meterType }) => {
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false);
  const [activeButton, setActiveButton] = useState(1);
  const [reportLoading, setReportLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState(null);

  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const facility_status = useSelector(
    (state) => state?.facilityReducer?.facilityStatus?.data
  );
  const weatherStationsData = useSelector(
    (state) => state?.baselineReducer?.stationDetails
  );
  const { id } = useParams();
  // const dataSetId = process.env.REACT_APP_DATA_EXPLORATION_DATASET_ID;
  // const reportId = process.env.REACT_APP_DATA_EXPLORATION_REPORT_ID;
  // const embedUrl = process.env.REACT_APP_DATA_EXPLORATION_EMBED_URL;

  // Dynamically set dataSetId, reportId, and embedUrl based on meterType
  let dataSetId, reportId, embedUrl;

  switch (meterType) {
    case 1: // Electricity
      dataSetId = process.env.REACT_APP_DATA_EXPLORATION_DATASET_ID_ELECTRICITY;
      reportId = process.env.REACT_APP_DATA_EXPLORATION_REPORT_ID_ELECTRICITY;
      embedUrl = process.env.REACT_APP_DATA_EXPLORATION_EMBED_URL_ELECTRICITY;
      break;
    case 3: // Natural Gas
      dataSetId = process.env.REACT_APP_DATA_EXPLORATION_DATASET_ID_NG;
      reportId = process.env.REACT_APP_DATA_EXPLORATION_REPORT_ID_NG;
      embedUrl = process.env.REACT_APP_DATA_EXPLORATION_EMBED_URL_NG;
      break;
    default:
      // Set to null or provide a default behavior
      dataSetId = null;
      reportId = null;
      embedUrl = null;
  }

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
    setReportLoading(true);
    // setReportParameters(btn_name);
  };

  useEffect(() => {
    if (facilityData?.id) {
      getDataFramePeriod();
    }
  }, [facilityData, meterType]);

  useEffect(() => {
    if (facilityData && timeFrame && weatherStationsData) {
      setReportLoading(true);
      getPowerBiToken();
    }
  }, [facilityData, timeFrame, weatherStationsData, meterType]);

  function getDataFramePeriod() {
    const apiURL = BASELINE_ENDPOINTS.GET_DATA_EXPLORATION_TIME_PERIOD;
    GET_REQUEST(
      apiURL + `?facility_id=${facilityData.id}&meter_type=${meterType}`
    )
      .then((response) => {
        setTimeFrame(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching data frame period:", error);
        setReportLoading(false);
      });
  }

  function getPowerBiToken() {
    const apiURL = POWERBI_ENDPOINTS.GET_AZURE_TOKEN_FOR_POWER_BI;
    GET_REQUEST(apiURL)
      .then((response) => {
        localStorage.setItem(
          "powerBiAccessToken",
          response?.data?.access_token
        );
        getPowerBiReportToken();
      })
      .catch((error) => {
        console.error("Error fetching Power BI token:", error);
        setReportLoading(false);
      });
  }

  function getPowerBiReportToken() {
    setReportLoading(true);
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const body = {
      datasets: [{ id: dataSetId }],
      reports: [{ allowEdit: true, id: reportId }],
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        localStorage.setItem("powerBiReportToken", JSON.stringify(res?.data));
        setReportLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Power BI report token:", error);
        setReportLoading(false);
      });
  }

  const powerBiReportToken =
    JSON.parse(localStorage.getItem("powerBiReportToken")) || null;

  // const setReportParameters = (currentActiveButton) => {
  //   if (
  //     !timeFrame?.start_date ||
  //     !timeFrame?.end_date ||
  //     !weatherStationsData?.[0]?.station_id
  //   ) {
  //     console.error("Missing required data for PowerBI parameters:", {
  //       timeFrame,
  //       weatherStationsData,
  //     });
  //     setReportLoading(false);
  //     return;
  //   }

  //   const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${dataSetId}/Default.UpdateParameters`;
  //   const body = {
  //     updateDetails: [
  //       {
  //         name: "facility_id",
  //         newValue: facilityData?.id,
  //       },
  //       {
  //         name: "meter_type",
  //         newValue: currentActiveButton,
  //       },
  //       {
  //         name: "from_date",
  //         newValue: format(new Date(timeFrame.start_date), "yyyy-MM-dd"),
  //       },
  //       {
  //         name: "to_date",
  //         newValue: format(new Date(timeFrame.end_date), "yyyy-MM-dd"),
  //       },
  //       {
  //         name: "station_id",
  //         newValue: weatherStationsData[0].station_id,
  //       },
  //     ],
  //   };

  //   POWERBI_POST_REQUEST(apiURL, body)
  //     .then(() => {
  //       setReportLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error updating PowerBI parameters:", error);
  //       setReportLoading(false);
  //     });
  // };

  const powerBiConfig = {
    type: "report",
    id: reportId,
    embedUrl: `${embedUrl}&filter=Energy/facility_id eq ${id}`,
    accessToken: powerBiReportToken?.token || null,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: false,
        },
        pageNavigation: {
          visible: false,
        },
      },
      background: models.BackgroundType.Transparent,
    },
  };

  const getPowerBiError = (errorDetail) => {
    console.error("Error in PowerBI", errorDetail);
    setIsErrorInPowerBi(true);
  };

  const renderContent = () => {
    if (reportLoading) {
      return <Typography>Loading...</Typography>;
    }

    if (isErrorInPowerBi) {
      return (
        <Typography>
          An error occurred while loading the Power BI report. Please try again
          later.
        </Typography>
      );
    }

    if (!facility_status?.timeline?.ew) {
      return (
        <Typography
          variant="h3"
          sx={{
            fontWeight: "700",
            fontSize: "1.125rem !important",
            lineHeight: "106.815%",
            letterSpacing: "-0.01125rem",
          }}
        >
          Either data has not been uploaded and verified yet or uploaded data is
          in processing state, so this visualization is not available.
        </Typography>
      );
    }

    return (
      <PowerBIEmbed
        embedConfig={powerBiConfig}
        eventHandlers={
          new Map([["error", (event) => getPowerBiError(event.detail)]])
        }
        cssClassName={"bi-embedded"}
        getEmbeddedComponent={(embeddedReport) => {
          window.report = embeddedReport;
        }}
      />
    );
  };

  if (!dataSetId || !reportId || !embedUrl) {
    console.error(
      "Invalid meterType or missing dataSetId, reportId, or embedUrl."
    );
    return <Typography variant="h5" color="red" >Invalid or missing configuration for Visualization.</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 1rem",
      }}
    >
      <Grid>
        <Box id="bi-report">{renderContent()}</Box>
      </Grid>
    </Box>
  );
};

export default DataVisualization;
