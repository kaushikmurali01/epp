import { Grid } from "@mui/material";
import React from "react";

const DataVisualization = () => {
  return (
    <Grid
      sx={{
        display: "flex",
        gap: "2rem",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        sx={{ minHeight: "200px" }}
      >
        graph container
      </Grid>
    </Grid>
  );
};

export default DataVisualization;
