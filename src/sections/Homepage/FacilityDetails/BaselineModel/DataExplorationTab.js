import { Grid } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React, { useEffect, useState } from "react";
import DataSummary from "./DataSummary";
import DataVisualization from "./DataVisualization";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showObserveData } from "../../../../redux/superAdmin/actions/baselineAction";

const DataExplorationTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [expanded, setExpanded] = useState("visualization");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // useEffect(() => {
  //   dispatch(showObserveData());
  // }, [id]);

  return (
    <Grid item>
      <CustomAccordion
        summary="Visualization"
        // details={<DataVisualization />}
        panelId="visualization"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Summary"
        details={<DataSummary />}
        panelId="summary"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
    </Grid>
  );
};

export default DataExplorationTab;
