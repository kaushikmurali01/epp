import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GET_REQUEST } from "utils/HTTPRequests";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { models } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { CustomToggleButton } from "./styles";
import { useParams } from "react-router-dom";

const filterGraphOption = [
  { label: "Time series", value: "time_series" },
  { label: "Box plot", value: "box_plot" },
  { label: "Heatmap", value: "heatmap" },
];

const DataVisualization = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [reportLoading, setReportLoading] = useState(true);
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false);
  const [error, setError] = useState(null);
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const [selectedGraphFilter, setSelectedGraphFilter] = useState("time_series");
  const { id } = useParams();

  const facility_status = useSelector(
    (state) => state?.facilityReducer?.facilityStatus?.data
  );

  const powerBiConfigs = useMemo(
    () => ({
      box_plot: {
        dataSetId: process.env.REACT_APP_DATA_EXPLORATION_BOXPLOT_DATASET_ID,
        reportId: process.env.REACT_APP_DATA_EXPLORATION_BOXPLOT_REPORT_ID,
        embedUrl: process.env.REACT_APP_DATA_EXPLORATION_BOXPLOT_EMBED_URL,
      },
      heatmap: {
        dataSetId: process.env.REACT_APP_DATA_EXPLORATION_HEATMAP_DATASET_ID,
        reportId: process.env.REACT_APP_DATA_EXPLORATION_HEATMAP_REPORT_ID,
        embedUrl: process.env.REACT_APP_DATA_EXPLORATION_HEATMAP_EMBED_URL,
      },
    }),
    []
  );

  useEffect(() => {
    if (!facilityData || selectedGraphFilter === "time_series") return;
    getPowerBiToken();
  }, [facilityData, selectedGraphFilter]);

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
        setError("Failed to get Power BI token");
        setReportLoading(false);
      });
  };

  const getPowerBiReportToken = () => {
    setReportLoading(true);
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const { dataSetId, reportId } = powerBiConfigs[selectedGraphFilter];
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
        setReportParameters();
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

  const setReportParameters = () => {
    const { dataSetId } = powerBiConfigs[selectedGraphFilter];
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${dataSetId}/Default.UpdateParameters`;
    const body = {
      updateDetails: [
        {
          name: "facility_id",
          newValue: facilityData?.id,
        },
        {
          name: "created_by",
          newValue: facilityData?.created_by,
        },
        {
          name: "meter_id",
          newValue: "3",
        },
        {
          name: "granularity",
          newValue: "daily",
        },
      ],
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        console.log("resss after setting parameters", res);
        refreshPowerBiReport();
      })
      .catch((error) => {
        setReportLoading(false);
        console.log(error);
      });
  };

  const refreshPowerBiReport = () => {
    const { dataSetId } = powerBiConfigs[selectedGraphFilter];
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${dataSetId}/refreshes`;
    const body = {
      retryCount: 3,
    };
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        console.log("resss after refreshing", res);
        setReportLoading(false);
      })
      .catch((error) => {
        setReportLoading(false);
        console.log(error);
      });
  };

  let powerBiConfig =
    selectedGraphFilter !== "time_series"
      ? {
          type: "report",
          id: powerBiConfigs[selectedGraphFilter].reportId,
          embedUrl: powerBiConfigs[selectedGraphFilter].embedUrl,
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
        }
      : null;

  const getPowerBiError = (errorDetail) => {
    console.log("Error in setIsErrorInPowerBi", errorDetail);
  };

  const handleGraphOptionChange = (value) => {
    if (selectedGraphFilter === value) {
      setSelectedGraphFilter(null);
    } else {
      setSelectedGraphFilter(value);
    }
  };

  const graphUrl = `https://ams-enerva-dev.azure-api.net/v1/graph?facility_id=${id}`;

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      {filterGraphOption.map((option) => (
        <CustomToggleButton
          key={option.value}
          value={option.value}
          selected={selectedGraphFilter === option.value}
          onChange={() => handleGraphOptionChange(option.value)}
        >
          {option.label}
        </CustomToggleButton>
      ))}

      {selectedGraphFilter === "time_series" ? (
        <iframe
          src={graphUrl}
          width="100%"
          height="500px"
          frameBorder="0"
          title="Facility Graph"
        />
      ) : (
        <Grid>
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
                Either data has not been uploaded and verified yet or uploaded
                data is in processing state, so this visualization is not
                available.
              </Typography>
            )}
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default DataVisualization;
