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

const BoxCard = styled(Box)(({ theme }) => {
  return {
    backgroundColor: "#FEFFE6",
    padding: "0.625rem",
    borderRadius: "0.75rem",
  };
});

const FacilityHeader = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

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
                src=""
                alt="FacilityImage"
                sx={{
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
              <Typography variant="h5">Walmart 3</Typography>
              <Typography variant="small2" gutterBottom>
                3121, Dummy Address, Ontario.
              </Typography>
              <Box>
                <FacilityStatus>In First P4P</FacilityStatus>
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
              <Typography variant="h6">48567425</Typography>
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
