import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { POWERBI_POST_REQUEST } from "utils/powerBiHttpRequests";
import { GET_REQUEST } from "utils/HTTPRequests";
import { POWERBI_ENDPOINTS } from "constants/apiEndPoints";

const EnergyUseByHoursBasisGraph = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [isErrorInPowerBi, setIsErrorInPowerBi] = useState(false)
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );


  const dataSetId = process.env.REACT_APP_ENERGY_WATER_DATASET_ID
  const reportId = process.env.REACT_APP_ENERGY_WATER_REPORT_ID
  const embedUrl = process.env.REACT_APP_ENERGY_WATER_EMBED_URL

  const [reportLoading, setReportLoading] = useState(true)

  const facility_status = useSelector(
    (state) => state?.facilityReducer?.facilityStatus?.data
  );

  useEffect(() => {
    if(!facilityData) return;
    getPowerBiToken()
  }, [facilityData])

  const getPowerBiToken = () => {
    const apiURL = POWERBI_ENDPOINTS.GET_AZURE_TOKEN_FOR_POWER_BI

    GET_REQUEST(apiURL).then((response) => {
      localStorage.setItem("powerBiAccessToken", (response?.data?.access_token));
      getPowerBiReportToken()
    })
    .catch((error) => {
      console.log(error);
      if(error?.response?.status == 403){
      }
      setReportLoading(false);
    });
  }

  const getPowerBiReportToken= () => {
    setReportLoading(true)
    const apiURL = POWERBI_ENDPOINTS.GET_POWERBI_TOKEN;
    const body = {
      "datasets": [
        {
          "id": dataSetId
        }
      ],
      "reports": [
        {
          "allowEdit": true,
          "id": reportId
        }
      ]
    }
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        localStorage.setItem("powerBiReportToken", JSON.stringify(res?.data))
        setReportParameters();
      })
      .catch((error) => {
        console.log(error);
        if(error?.response?.status == 403){
        }
        setReportLoading(false);
      });
  }

  let powerBiReportToken = localStorage.getItem("powerBiReportToken") ? JSON.parse(localStorage.getItem("powerBiReportToken")) : null;

  const setReportParameters = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${dataSetId}/Default.UpdateParameters`
    const body = {
      "updateDetails": [
        {
          "name": "facility_id",
          "newValue": facilityData?.id
        },
        {
          "name": "created_by",
          "newValue":facilityData?.created_by
        },
        {
          "name": "meter_id",
          "newValue": "2"
        },
        {
          "name": "granularity",
          "newValue": "daily"
        }
      ]
    }
    POWERBI_POST_REQUEST(apiURL, body)
      .then((res) => {
        console.log("resss after setting parameters", res)
        refreshPowerBiReport()
      })
      .catch((error) => {
        setReportLoading(false)
        console.log(error);
      });
  }

  const refreshPowerBiReport = () => {
    const apiURL = `https://api.powerbi.com/v1.0/myorg/groups/d5ca9c18-0e45-4f7a-8b5a-0e0c75ddec73/datasets/${dataSetId}/refreshes`
    const body = {
      retryCount: 3
    }
    POWERBI_POST_REQUEST(apiURL, body, )
      .then((res) => {
        console.log("resss after refreshing", res)
        setReportLoading(false)
      })
      .catch((error) => {
        setReportLoading(false)
        console.log(error);
      });
  }
  
  let powerBiConfig = {
    type: "report",
    id: reportId,
    embedUrl: embedUrl, 
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
  }

  const getPowerBiError = (errorDetail) => {
    console.log('Error in setIsErrorInPowerBi',errorDetail)
  }


 
  return (
    <Box
      sx={{
        width: "100%",
        padding: "0",
        marginTop: isSmallScreen && "2rem",
        
      }}
    >
      <Grid container>     
      <Grid sx={{ width: '100%', }}>
        <Box id="bi-report" mt={4}>
          {(true) ? <PowerBIEmbed
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
            cssClassName={"bi-embedded energy-use-by-hour-embedded"}
            getEmbeddedComponent={(embeddedReport) => {
              window.report = embeddedReport;
            }}
          /> : 
          <Typography
            variant="h3"
            sx={{
              fontWeight: "700",
              fontSize: "1.125rem !important",
              lineHeight: "1",
              letterSpacing: "-0.01125rem",
            }}
          >
            Either data has not been uploaded and verified yet or uploaded data is in processing state, so this visualization is not available.
          </Typography>}
        </Box>
      </Grid>
      </Grid>
    </Box>
  );
};

export default EnergyUseByHoursBasisGraph;
