import { Box, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { GET_REQUEST } from "utils/HTTPRequests";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";
import {
  activeButtonStyle,
  inactiveButtonStyle,
  StyledButtonGroup,
} from "./styles";
import { useParams } from "react-router-dom";

const DataVisualization = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false);
  const [activeButton, setActiveButton] = useState(1);
  const [reportLoading, setReportLoading] = useState(true);
  
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  const facility_status = useSelector(
    (state) => state?.facilityReducer?.facilityStatus?.data
  );
  const { id } = useParams();
  const dataSetId = process.env.REACT_APP_DATA_EXPLORATION_DATASET_ID;
  const reportId = process.env.REACT_APP_DATA_EXPLORATION_REPORT_ID;
  const embedUrl = process.env.REACT_APP_DATA_EXPLORATION_EMBED_URL;

  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
    setReportLoading(true);
    // setReportParameters(btn_name);
  };

  useEffect(() => {
    if (!facilityData) return;
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
        setReportLoading(false);
      });
  };

  const getPowerBiReportToken = () => {
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
        console.log(error);
        setReportLoading(false);
      });
  };

  // const setReportParameters = (currentActiveButton) => {
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
  //         newValue: "2022-07-20",
  //       },
  //       {
  //         name: "to_date",
  //         newValue: "2024-08-31",
  //       },
  //     ],
  //   };

  //   POWERBI_POST_REQUEST(apiURL, body)
  //     .then((res) => {
  //       console.log("Parameters updated successfully", res);
  //       setReportLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setReportLoading(false);
  //     });
  // };

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
    console.log("Error in PowerBI", errorDetail);
    setIsErrorInPowerBi(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <StyledButtonGroup disableElevation variant="contained" color="primary">
        <Button
          sx={activeButton === 1 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleButtonClick(1)}
        >
          Electricity
        </Button>
        <Button
          sx={activeButton === 3 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleButtonClick(3)}
        >
          Natural gas
        </Button>
      </StyledButtonGroup>
      <Grid>
        <Box id="bi-report" mt={4}>
          {facility_status?.timeline?.ew &&
          !isErrorInPowerBi &&
          !reportLoading ? (
            <PowerBIEmbed
              embedConfig={powerBiConfig}
              eventHandlers={
                new Map([
                  ["loaded", () => console.log("Report loaded")],
                  ["rendered", () => console.log("Report rendered")],
                  ["error", (event) => getPowerBiError(event.detail)],
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