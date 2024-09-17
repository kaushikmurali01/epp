import React, { useState, useMemo } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import CompanyChecklist from "./CompanyChecklist";

const SavingsIncentiveChecklist = ({
  savingsQuestions,
  incentiveQuestions,
}) => {
  const [expanded, setExpanded] = useState("savings");
  const [performanceP4PCalcTab, setPerformanceP4PCalcTab] = useState(1);

  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangePerformance = (event, newValue) => {
    setPerformanceP4PCalcTab(newValue);
  };

  const filteredSavingsQuestions = useMemo(
    () =>
      savingsQuestions?.filter(
        (q) => q.performance_type === performanceP4PCalcTab
      ),
    [savingsQuestions, performanceP4PCalcTab]
  );

  const filteredIncentiveQuestions = useMemo(
    () =>
      incentiveQuestions?.filter(
        (q) => q.performance_type === performanceP4PCalcTab
      ),
    [incentiveQuestions, performanceP4PCalcTab]
  );

  const isTabDisabled = (tabValue) => {
    // const hasQuestions =
    //   savingsQuestions?.some((q) => q.performance_type === tabValue) ||
    //   incentiveQuestions?.some((q) => q.performance_type === tabValue);
    // return !hasQuestions;
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
        details={
          <CompanyChecklist
            questions={filteredSavingsQuestions[0]?.questions_answers}
          />
        }
        panelId="savings"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Incentive"
        details={
          <CompanyChecklist
            questions={filteredIncentiveQuestions[0]?.questions_answers}
          />
        }
        panelId="incentive"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
    </>
  );
};

export default SavingsIncentiveChecklist;
