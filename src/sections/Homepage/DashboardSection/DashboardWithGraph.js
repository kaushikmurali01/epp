import React from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";

const DashboardWithGraph = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Grid container>
        <Grid item xs={6}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            Welcome Ben
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: { xs: "center", sm: "start" },
              fontWeight: "400",
              fontSize: "0.75rem",
              fontStyle: "italic",
              marginTop: "0.5rem",
            }}
          >
            Select pin on the map or facility from the list
          </Typography>
        </Grid>
        <Grid container xs={6} gap={4} justifyContent="flex-end">
          <Grid item alignContent="center">
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
              onClick={() => navigate("/admin/add-facility")}
            >
              Add Facility
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Box id="bi-report" mt={4}>
        <PowerBIEmbed
          embedConfig={{
            type: "report",
            id: "a4beb0d6-3454-425f-ac0c-9b96429bc422",
            embedUrl:
              "https://app.powerbi.com/reportEmbed?reportId=a4beb0d6-3454-425f-ac0c-9b96429bc422&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d",
            accessToken: "",
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
    </Container>
  );
};

export default DashboardWithGraph;
