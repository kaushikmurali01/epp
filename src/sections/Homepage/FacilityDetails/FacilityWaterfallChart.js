import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import { PowerBIEmbed } from "powerbi-client-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_REQUEST } from "utils/HTTPRequests";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { models } from "powerbi-client";
import { useParams } from "react-router-dom";

const FacilityWaterfallChart = () => {
  const [reportLoading, setReportLoading] = useState(true);
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const { id } = useParams();
  let dataSetId, reportId, embedUrl;
  dataSetId = process.env.REACT_APP_POWERBI_WATERFALL_CHART_DATASET_ID;
  reportId = process.env.REACT_APP_POWERBI_WATERFALL_CHART_REPORT_ID;
  embedUrl = process.env.REACT_APP_POWERBI_WATERFALL_CHART_EMBED_URL;

  console.log("dataSetId", dataSetId);
  

  const facility_status = useSelector(
    (state) => state?.facilityReducer?.facilityStatus?.data
  );

  useEffect(() => {
    if (!facilityData) return;
    setReportLoading(true);
    getPowerBiToken();
  }, [facilityData]);

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
    embedUrl: `${embedUrl}&filter=Incentive/facility_id eq ${id}`,
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

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Grid>
        <Box id="bi-report">
          {facility_status?.timeline?.ew && !reportLoading ? (
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
              cssClassName={"bi-embedded waterfall-chart"}
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
              Either data is not available or it is in processing state, Please Wait...
            </Typography>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default FacilityWaterfallChart;
