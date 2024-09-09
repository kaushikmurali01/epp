import { Grid } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React, { useState } from "react";
import SavingsIncentiveChecklist from "./SavingsIncentiveChecklist";

const QaQcChecklist = () => {
  const [expanded, setExpanded] = useState("company");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        padding: { xs: "0", md: "0 2rem" },
        marginTop: {xs: "2rem", md: 0},
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomAccordion
        summary="Company"
        details={""}
        panelId="company"
        expanded={expanded}
        onChange={handleAccordionChange}
        // isDisabled
      />
      <CustomAccordion
        summary="PA"
        details={""}
        panelId="pa"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Baseline model"
        details={""}
        panelId="baselineModel"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Facility"
        details={""}
        panelId="facility"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Pre-project Incentive"
        details={""}
        panelId="preProjectIncentive"
        expanded={expanded}
        onChange={handleAccordionChange}
      />

      <CustomAccordion
        summary="Pay for performance savings and incentives"
        details={<SavingsIncentiveChecklist />}
        panelId="p4pIncentivesAndSavings"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
    </Grid>
  );
};

export default QaQcChecklist;
