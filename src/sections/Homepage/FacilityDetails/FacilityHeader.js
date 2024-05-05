import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  useMediaQuery,
  styled,
} from "@mui/material";
import FacilityStatus from "components/FacilityStatus";
import React from "react";
import { useSelector } from "react-redux";

const BoxCard = styled(Box)(({ theme }) => {
  return {
    backgroundColor: "#FEFFE6",
    padding: "0.625rem",
    borderRadius: "0.75rem",
  };
});

const FacilityHeader = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const facilityDetails = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data
  );
  console.log(facilityDetails);
  return (
    <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection={isSmallScreen ? "column" : "row"}>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={facilityDetails?.display_pic_url}
                alt="FacilityImage"
                style={{
                  borderRadius: "50%",
                  height: "7.5rem",
                  width: "7.5rem",
                }}
              />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              sx={{ width: "100%" }}
              alignItems={isSmallScreen ? "center" : "start"}
            >
              <Typography variant="h5">
                {facilityDetails?.facility_name}
              </Typography>
              <Typography variant="small2" gutterBottom>
                {facilityDetails?.address}, {facilityDetails?.city},{" "}
                {facilityDetails?.country}
              </Typography>
              <Box>
                <FacilityStatus>
                  {facilityDetails?.facility_id_submission_status}
                </FacilityStatus>
              </Box>
              <Box>
                <Button
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                    minWidth: "unset",
                  }}
                >
                  Edit
                </Button>
                <Button
                  color="error"
                  style={{
                    backgroundColor: "transparent",
                    padding: 0,
                    minWidth: "unset",
                    marginLeft: "1rem",
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Graph section */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ height: 150 }}>
            <Typography variant="body2">Graph Placeholder</Typography>
          </Paper>
        </Grid>

        <Grid container item xs={12} md={4} spacing={1}>
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Facility ID</Typography>
              <Typography variant="h6">{facilityDetails?.id}</Typography>
            </BoxCard>
          </Grid>
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Total Incentive Paid</Typography>
              <Typography variant="h6">$246</Typography>
            </BoxCard>
          </Grid>
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Electricity Consumptions</Typography>
              <Typography variant="h6">455</Typography>
            </BoxCard>
          </Grid>
          <Grid item xs={6}>
            <BoxCard>
              <Typography variant="small2">Benchmarking EUI</Typography>
              <Typography variant="h6">5436</Typography>
            </BoxCard>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FacilityHeader;
