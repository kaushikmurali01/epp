import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import { useSelector } from "react-redux";

const Summary = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const facilityData = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
        marginTop: isSmallScreen && "2rem",
      }}
    >
      <Grid container>
        <Grid item>
          <Box
            sx={{
              cursor: "default",
              borderRadius: "2rem",
              background: "#EBEBEB",
              border: "1px solid #D0D0D0",
              textWrap: "nowrap",
              padding: "0.375rem 1rem",
            }}
          >
            <Typography variant="small">Summary</Typography>
          </Box>
        </Grid>
        <Grid container mt={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
            }}
          >
            <Box
              sx={{
                borderRight: !isSmallScreen && "1px solid #DDDDDD",
                padding: "0 20px 0 0",
              }}
            >
              <Typography variant="small">NAIC’s Code</Typography>
              <Typography variant="h6" gutterBottom>
                {facilityData?.naic_code}
              </Typography>
            </Box>

            <Box
              sx={{
                paddingLeft: !isSmallScreen && "20px",
                marginTop: isSmallScreen && "20px",
              }}
            >
              <Typography variant="small">Facility Category</Typography>
              <Typography variant="h6" gutterBottom>
                {facilityData?.facility_category}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid>
        <Box id="bi-report" mt={4}>
          <PowerBIEmbed
            embedConfig={{
              type: "report",
              id: "a4beb0d6-3454-425f-ac0c-9b96429bc422",
              embedUrl:
                "https://app.powerbi.com/reportEmbed?reportId=a4beb0d6-3454-425f-ac0c-9b96429bc422&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d",
              accessToken: process.env.REACT_APP_POWERBI_TOKEN,
              tokenType: models.TokenType.Aad,
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
            }}
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
                    console.log(event.detail);
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
        </Box>
      </Grid>
    </Box>
  );
};

export default Summary;
