import CustomAccordion from "components/CustomAccordion";
import React, { useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";


const SavingsIncentiveChecklist = () => {
  const [expanded, setExpanded] = useState("savings");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [performanceP4PCalcTab, setPerformanceP4PCalcTab] = useState(1);
  const handleChangePerformance = (event, newValue) => {
    setPerformanceP4PCalcTab(newValue);
  };

  const isTabDisabled = (tabValue) => {
    console.log(tabValue, "will be disabled.");
  };

  return (
    <>
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: { xs: "1.25rem", md: "1.75rem" },
        }}
        width={"100%"}
      >
        <Grid item>
          <Tabs
            className="theme-tabs-list"
            value={performanceP4PCalcTab}
            onChange={handleChangePerformance}
            sx={{
              display: "inline-flex",
              flexWrap: "wrap",
            }}
            variant="scrollable"
            scrollButtons={false}
          >
            <Tab
              value={1}
              label="First pay-for-performance"
              sx={{ minWidth: { xs: "auto", md: "10rem" } }}
              disabled={isTabDisabled(1)}
            />
            <Tab
              value={2}
              label="Second pay-for-performance"
              sx={{ minWidth: { xs: "auto", md: "10rem" } }}
              disabled={isTabDisabled(2)}
            />
            <Tab
              value={3}
              label="Third pay-for-performance"
              sx={{ minWidth: { xs: "auto", md: "10rem" } }}
              disabled={isTabDisabled(3)}
            />
          </Tabs>
        </Grid>
      </Grid>

      <CustomAccordion
        summary="Savings"
        details={""}
        panelId="savings"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Incentive"
        details={""}
        panelId="incentive"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
    </>
  );
};

export default SavingsIncentiveChecklist;
