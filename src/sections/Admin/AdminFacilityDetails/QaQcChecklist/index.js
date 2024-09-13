import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomAccordion from "components/CustomAccordion";
import SavingsIncentiveChecklist from "./SavingsIncentiveChecklist";
import CompanyChecklist from "./CompanyChecklist";
import Loader from "pages/Loader";
import { getQaQcChecklist } from "../../../../redux/admin/actions/adminQaQcChecklistActions";

const QaQcChecklist = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState("company");

  useEffect(() => {
    dispatch(getQaQcChecklist(id));
  }, [dispatch, id]);

  const { checklistQuestionsList, loading } = useSelector(
    (state) => state.adminQaQcChecklistReducer
  );

  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getQuestionsForSection = (sectionName) => {
    const section = checklistQuestionsList.find(
      (item) => item.name === sectionName
    );
    return section ? section.questions_answers : [];
  };

  const getAllSavingsQuestions = () => {
    return checklistQuestionsList.filter((item) => item.name === "saving");
  };

  const getAllIncentiveQuestions = () => {
    return checklistQuestionsList.filter((item) => item.name === "incentive");
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        padding: { xs: "0", md: "0 2rem" },
        marginTop: { xs: "2rem", md: 0 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomAccordion
        summary="Company"
        details={
          <CompanyChecklist questions={getQuestionsForSection("company")} />
        }
        panelId="company"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="PA"
        details={<CompanyChecklist questions={getQuestionsForSection("pa")} />}
        panelId="pa"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Baseline model"
        details={
          <CompanyChecklist questions={getQuestionsForSection("baseline")} />
        }
        panelId="baselineModel"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Facility"
        details={
          <CompanyChecklist questions={getQuestionsForSection("facility")} />
        }
        panelId="facility"
        expanded={expanded}
        onChange={handleAccordionChange}
      />
      <CustomAccordion
        summary="Pre-project Incentive"
        details={
          <CompanyChecklist questions={getQuestionsForSection("pre-project")} />
        }
        panelId="preProjectIncentive"
        expanded={expanded}
        onChange={handleAccordionChange}
      />

      <CustomAccordion
        summary="Pay for performance savings and incentives"
        details={
          <SavingsIncentiveChecklist
            savingsQuestions={getAllSavingsQuestions()}
            incentiveQuestions={getAllIncentiveQuestions()}
          />
        }
        panelId="p4pIncentivesAndSavings"
        expanded={expanded}
        onChange={handleAccordionChange}
      />

      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </Grid>
  );
};

export default QaQcChecklist;
