import { Button, Grid } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React, { useEffect, useState } from "react";
import DataSummary from "./DataSummary";
import DataVisualization from "./DataVisualization";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showAdminObserveData } from "../../../../redux/admin/actions/adminBaselineAction";
import {
  activeButtonStyle,
  inactiveButtonStyle,
  StyledButtonGroup,
} from "./styles";

const DataExplorationTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [activeButton, setActiveButton] = useState(1);
  const handleButtonClick = (btn_name) => {
    setActiveButton(btn_name);
  };

  const [expanded, setExpanded] = useState("visualization");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid item>
      <StyledButtonGroup
        disableElevation
        variant="contained"
        color="primary"
        sx={{ marginBlockEnd: "1.5rem" }}
      >
        <Button
          sx={activeButton === 1 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleButtonClick(1)}
        >
          Electricity
        </Button>
        <Button
          sx={activeButton === 3 ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => handleButtonClick(3)}
        >
          Natural gas
        </Button>
      </StyledButtonGroup>

      <CustomAccordion
        summary="Visualization"
        details={<DataVisualization meterType={activeButton} />}
        panelId="visualization"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Summary"
        details={<DataSummary meterType={activeButton} />}
        panelId="summary"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
    </Grid>
  );
};

export default DataExplorationTab;
