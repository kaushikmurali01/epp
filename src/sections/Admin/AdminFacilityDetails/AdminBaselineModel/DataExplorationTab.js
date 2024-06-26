import { Grid } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React from "react";
import DataSummary from "./DataSummary";
import DataVisualization from "./DataVisualization";

const DataExplorationTab = () => {
  return (
    <Grid item>
      <CustomAccordion
        summary="Visualization"
        details={<DataVisualization />}
        panelId="visualization"
      />
      <CustomAccordion
        summary="Summary"
        details={<DataSummary />}
        panelId="summary"
      />
    </Grid>
  );
};

export default DataExplorationTab;
