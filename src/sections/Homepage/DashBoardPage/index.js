import { Box, Container, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import "../UserManagementSection/styles.css";
import useMediaQueries from "utils/mediaQueries/mediaQueries";
import CustomTextHeader from "components/CustomTextHeader";
import { useState } from "react";
import AdminFacilityStatus from "components/AdminFacilityStatus";

const DashboardPage = (props) => {
  const [number, setNumber] = useState("XXXX");
  const { isLg } = useMediaQueries();

  return (
    <Container>
      <Box>
        <Grid
          container
          sx={{
            alignItems: { xs: "flex-start", lg: "center" },
            flexWrap: { xs: "nowrap", lg: "wrap" },
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: { xs: "flex-start", lg: "center" },
            // padding: { xs: "1.12rem 2rem", lg: "1.16rem 1.29rem" },
            marginTop: "1.88rem",
            borderRadius: "0.75rem",
            height: "5rem",
            flexDirection: "column",
          }}
        >
          <Grid width="50%" display="flex" flexDirection="row">
            <Grid width="60%" display="flex">
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  alignItems: "left",
                }}
              >
                Dashboard
                <br />{" "}
                {/* <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "400",
                    fontSize: ".725rem",
                  }}
                >
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                </Typography> */}
              </Typography>
            </Grid>
            <Grid width="40%" display="flex">
              <AdminFacilityStatus>Status: Average Savings</AdminFacilityStatus>
            </Grid>
          </Grid>
          <Box>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontSize: "0.50rem",
                fontWeight: "bold",
                alignItems: "left",
              }}
            >
              Totals By: Individual Customers
              <br />{" "}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "400",
                  fontSize: "0.50rem",
                }}
              >
                Show: Today
              </Typography>
            </Typography>
          </Box>
        </Grid>

        <Grid
          container
          sx={{
            alignItems: { xs: "flex-start", lg: "center" },
            flexWrap: { xs: "nowrap", lg: "wrap" },
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: { xs: "flex-start", lg: "center" },
            // padding: { xs: "1.12rem 2rem", lg: "1.16rem 1.29rem" },
            marginTop: "1.88rem",
            borderRadius: "0.75rem",
            height: "10rem",
            backgroundColor: "#F9FBF9",
          }}
        >
          <CustomTextHeader
            heading1={isLg ? "Number of customers" : "Number of customers"}
            heading2={isLg ? "" : number}
            count="1"
          />
          <CustomTextHeader
            heading1={isLg ? "Number of aggregators" : "Number of aggregators"}
            heading2={isLg ? "" : number}
            count="2"
          />
          <CustomTextHeader
            heading1={
              isLg
                ? "Total number of facilities enrolled"
                : "Total number of facilities enrolled"
            }
            heading2={isLg ? "" : number}
            count="3"
          />
          <CustomTextHeader
            heading1={
              isLg
                ? "Total Baseline Energy Consumption Enrolled (MWh)"
                : "Total Baseline Energy Consumption Enrolled (MWh)"
            }
            heading2={isLg ? "" : number}
            count="4"
          />
          <CustomTextHeader
            heading1={
              isLg ? "Total Energy Savings (MWh)" : "Total Energy Savings (MWh)"
            }
            heading2={isLg ? "" : number}
            count="5"
          />
          <CustomTextHeader
            heading1={
              isLg ? "Total Incentive Paid ($)" : "Total Incentive Paid ($)"
            }
            heading2={isLg ? "" : number}
            count="6"
          />
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;
