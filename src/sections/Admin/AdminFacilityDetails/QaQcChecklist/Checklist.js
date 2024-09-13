import {
  Grid,
  Input,
  InputLabel,
  TextareaAutosize as BaseTextareaAutosize,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 320px;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: "text.primary2";
  background: "#fff";
  border: 1px solid #2e813e;

  &:hover {
    border-color: primary.mainLightShade;
  }

  &:focus {
    border-color: primary.mainLightShade;
    box-shadow: 0 0 0 1px #3ea65c;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const Checklist = ({ question }) => {
  const [showTextArea, setShowTextArea] = useState(false);

  const handleChange = (event, newValue) => {
    console.log(`Question ${question.question_id} answered:`, newValue);
    if (question.question_type === "optional_text") {
      setShowTextArea(newValue === "YES");
    }
  };

  return (
    <Grid
      container
      paddingInline="0.5rem"
      gap={"0.5rem"}
      alignItems="center"
      justifyContent="space-between"
      key={question.question_id}
    >
      <Grid item>
        <InputLabel
          htmlFor={`question-${question.question_id}`}
          style={{ whiteSpace: "initial" }}
        >
          {question.question_id}
          {") "}
          {question.question}
        </InputLabel>
      </Grid>
      <Grid item>
        <Grid container direction="column" spacing={1} alignItems={"flex-end"}>
          {question.question_type === "optional" && (
            <Grid item>
              <ToggleButtonGroup
                className="checklist-btn-group"
                id={`question-${question.question_id}`}
                exclusive
                value={question.answer || "NO"}
                onChange={handleChange}
              >
                <ToggleButton
                  className="theme-toggle-yes"
                  value="YES"
                  sx={{ fontSize: "0.875rem" }}
                >
                  Yes
                </ToggleButton>
                <ToggleButton
                  className="theme-toggle-no"
                  value="NO"
                  sx={{ fontSize: "0.875rem" }}
                >
                  No
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          )}
          {question.question_type === "date" && (
            <Grid item>
              <DatePicker
                sx={{
                  "& .MuiInputBase-root": {
                    height: "2rem",
                    fontSize: "0.875rem",
                  },
                  "& .MuiInputBase-input": {
                    padding: "0.25rem 0.5rem",
                    color: "#242424",
                  },
                }}
                slotProps={{
                  textField: {
                    readOnly: true,
                  },
                }}
              />
            </Grid>
          )}
          {question.question_type === "optional_na" && (
            <Grid item>
              <ToggleButtonGroup
                className="checklist-btn-group"
                id={`question-${question.question_id}`}
                exclusive
                value={question.answer || "NO"}
                onChange={handleChange}
              >
                <ToggleButton
                  className="theme-toggle-yes"
                  value="YES"
                  sx={{ fontSize: "0.875rem" }}
                >
                  Yes
                </ToggleButton>
                <ToggleButton
                  className="theme-toggle-no"
                  value="NO"
                  sx={{ fontSize: "0.875rem" }}
                >
                  No
                </ToggleButton>
                <ToggleButton
                  className="theme-toggle-yes"
                  value="N/A"
                  sx={{ fontSize: "0.875rem" }}
                >
                  N/A
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          )}
          {question.question_type === "optional_text" && (
            <>
              <Grid item>
                <ToggleButtonGroup
                  className="checklist-btn-group"
                  id={`question-${question.question_id}`}
                  exclusive
                  value={question.answer || "NO"}
                  onChange={handleChange}
                >
                  <ToggleButton
                    className="theme-toggle-yes"
                    value="YES"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Yes
                  </ToggleButton>
                  <ToggleButton
                    className="theme-toggle-no"
                    value="NO"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    No
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {showTextArea && (
                <Grid item>
                  <TextareaAutosize minRows={3} style={{ width: "100%" }} />
                </Grid>
              )}
            </>
          )}
          {question.question_type === "text" && (
            <Grid item>
              <TextareaAutosize minRows={3} style={{ width: "100%" }} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Checklist;