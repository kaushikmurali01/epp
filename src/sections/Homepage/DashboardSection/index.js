import { Box, Container, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CustomBox from "../../../components/CustomBox";
import "../UserManagementSection/styles.css";
import useMediaQueries from "utils/mediaQueries/mediaQueries";

const DashboardArrow = () => {
  return (
    <Box
      sx={{
        rotate: { xs: "90deg", lg: "none" },
        marginLeft: { xs: "5px", lg: "0" },
      }}
    >
      <img src="images/dashboard-arrow.svg" alt="arrow" />
    </Box>
  );
};

const DashboardSection = (props) => {
  const { isLg } = useMediaQueries();

  return (
    <Container>
      <Box>
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
            fontWeight: "400",
            fontSize: "1.125rem",
          }}
        >
          You are a few steps away from enrolling your facilities in the
          program. For all facilities, you have to do the following steps:
        </Typography>

        <Grid
          container
          sx={{
            alignItems: { xs: "flex-start", lg: "center" },
            flexWrap: { xs: "nowrap", lg: "wrap" },
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: { xs: "flex-start", lg: "center" },
            gap: "0.69rem",
            padding: { xs: "1.12rem 2rem", lg: "1.16rem 1.29rem" },
            marginTop: "1.88rem",
            borderRadius: "0.75rem",
            background: "#EBFFEF",
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%232E813EB3' stroke-width='5' stroke-dasharray='6%2c 14' stroke-dashoffset='30' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
        >
          <CustomBox
            heading1={isLg ? "Create facility" : "Create"}
            heading2={isLg ? "" : "facility"}
            count="1"
          />
          <DashboardArrow />
          <CustomBox
            heading1={isLg ? "Add facility information" : "Add facility"}
            heading2={isLg ? "" : "information"}
            count="2"
          />
          <DashboardArrow />
          <CustomBox
            heading1={
              isLg ? "Submit facility for baseline model" : "Submit facility"
            }
            heading2={isLg ? "" : "for baseline model"}
            count="3"
          />
          <DashboardArrow />
          <CustomBox
            heading1={
              isLg ? "Review and accept baseline model" : "Review and accept"
            }
            heading2={isLg ? "" : "baseline model"}
            count="4"
          />
          <DashboardArrow />
          <CustomBox
            heading1={isLg ? "Enrol your facility" : "Enrol your"}
            heading2={isLg ? "" : "facility"}
            count="5"
          />
          <DashboardArrow />
          <CustomBox
            heading1={
              isLg
                ? "Start saving energy and earn incentives for the facility"
                : "Start saving energy and"
            }
            heading2={isLg ? "" : "earn incentives for the facility"}
            count="6"
          />
        </Grid>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: { xs: "center", sm: "start" },
            fontWeight: "400",
            fontSize: "0.75rem",
            fontStyle: "italic",
            marginTop: "0.5rem",
          }}
        >
          Please note that signing{" "}
          <span className="participant-text">Participant Agreement</span> is
          mandatory before you enrol your facility. All facilities in the
          Facility List are included under the signed Participant Agreement.
        </Typography>
      </Box>
      <Grid
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="1.44rem"
        marginTop="6.9rem"
      >
        <Typography variant="h4" textAlign="center">
          Add facility details and start saving
        </Typography>
        <Button
          color="primary"
          variant="contained"
          component="a"
          href="/add-facility"
        >
          Add Facility
        </Button>
      </Grid>
    </Container>
  );
};

export default DashboardSection;
