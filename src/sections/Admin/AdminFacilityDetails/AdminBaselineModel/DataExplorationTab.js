import { Grid } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React, { useEffect } from "react";
import DataSummary from "./DataSummary";
import DataVisualization from "./DataVisualization";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showAdminObserveData } from "../../../../redux/admin/actions/adminBaselineAction";

const DataExplorationTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(showAdminObserveData());
  }, [id]);

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
