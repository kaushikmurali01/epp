import { Grid } from "@mui/material";
import React from "react";
import Checklist from "./Checklist";

const CompanyChecklist = ({ questions }) => {
  return (
    <Grid container spacing={2}>
      {questions && questions?.map((question, index) => (
        <Grid item xs={12} key={question?.question_id}>
          <Checklist question={question} index={index} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CompanyChecklist;
