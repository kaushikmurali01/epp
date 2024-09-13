import { Grid } from "@mui/material";
import CustomAccordion from "components/CustomAccordion";
import React, { useEffect, useState } from "react";
import SavingsIncentiveChecklist from "./SavingsIncentiveChecklist";
import { useDispatch, useSelector } from "react-redux";
import { getQaQcChecklist } from "../../../../redux/admin/actions/adminQaQcChecklistActions";
import { useParams } from "react-router-dom";
import Loader from "pages/Loader";
import CompanyChecklist from "./CompanyChecklist";

const QaQcChecklist = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState("company");
  const handleAccordionChange = (panel, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    dispatch(getQaQcChecklist(id));
  }, [dispatch, id])

  const { checklistQuestions, loading} = useSelector(
    (state) => state.adminQaQcChecklistReducer
  );

  console.log(checklistQuestions);
  
  const questions = [
    {
      question_id: 1,
      name: "company",
      question: "Does the Company exist?",
      question_type: "optional",
      options: null,
      sequence_order: 1,
      dependent_id: null,
      answer: null,
    },
    {
      question_id: 2,
      name: "company",
      question:
        "Is the Company a duplicate that is not based on exact replication of name?",
      question_type: "optional",
      options: null,
      sequence_order: 2,
      dependent_id: null,
      answer: null,
    },
    {
      question_id: 6,
      name: "company",
      question: "Are there any other comments for the Company eligibility?",
      question_type: "text",
      options: null,
      sequence_order: 6,
      dependent_id: null,
      answer: null,
    },
    {
      question_id: 10,
      name: "pa",
      question: "What was the date for the signature?",
      question_type: "date",
      options: null,
      sequence_order: 4,
      dependent_id: null,
      answer: null,
    },
    {
      question_id: 14,
      name: "facility",
      question:
        "What is the relationship between the Company and the Facility?",
      question_type: "dropdown",
      options: ["Owned", "Tenant", "Managed", "Service Provider", "Other"],
      sequence_order: 1,
      dependent_id: null,
      answer: null,
    },
    {
      question_id: 29,
      name: "saving",
      question:
        "Is there any Funded Projects completed in P4P including Retrofit, ECBX, etc.?",
      question_type: "optional_text",
      options: null,
      sequence_order: 7,
      dependent_id: null,
      answer: null,
    },
    {
      question_id: 75,
      name: "saving",
      question: "Is the peak demand reduction value correct?",
      question_type: "optional_na",
      options: null,
      sequence_order: 15,
      dependent_id: null,
      answer: null,
    },
  ];
  
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
        details={<CompanyChecklist questions={questions} />}
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
