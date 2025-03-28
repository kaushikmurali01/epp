import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { GET_REQUEST } from "utils/HTTPRequests";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import { useParams } from "react-router-dom";

const DataVisualization = ({ meterType }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false);
  const facilityData = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data
  );
  const { id } = useParams();
  // const dataSetId = process.env.REACT_APP_DATA_EXPLORATION_DATASET_ID_ELECTRICITY;
  // const reportId = process.env.REACT_APP_DATA_EXPLORATION_REPORT_ID_ELECTRICITY;
  // const embedUrl = process.env.REACT_APP_DATA_EXPLORATION_EMBED_URL_ELECTRICITY;

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

  const [reportLoading, setReportLoading] = useState(true);

  const facility_status = useSelector(
    (state) => state?.adminFacilityReducer?.facilityStatus?.data
  );

  useEffect(() => {
    if (!facilityData) return;
    setReportLoading(true);
    getPowerBiToken();
  }, [facilityData, meterType]);

  const getPowerBiToken = () => {
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
        console.log(error);
        if (error?.response?.status == 403) {
        }
        setReportLoading(false);
      });
  };

  const getPowerBiReportToken = () => {
    setReportLoading(true);
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const body = {
      datasets: [
        {
          id: dataSetId,
        },
      ],
      reports: [
        {
          allowEdit: true,
          id: reportId,
        },
      ],
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        localStorage.setItem("powerBiReportToken", JSON.stringify(res?.data));
        setReportLoading(false);
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

  let powerBiConfig = {
    type: "report",
    id: reportId,
    embedUrl: `${embedUrl}&filter=Energy/facility_id eq ${id}`,
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
      // hideErrors: true
    },
  };

  const getPowerBiError = (errorDetail) => {
    console.log("Error in setIsErrorInPowerBi", errorDetail);
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
        <Box id="bi-report">
          {facility_status?.timeline?.ew &&
          !isErrorInPowerBi &&
          !reportLoading ? (
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
              Either data has not been uploaded and verified yet or uploaded
              data is in processing state, so this visualization is not
              available.
            </Typography>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default DataVisualization;
