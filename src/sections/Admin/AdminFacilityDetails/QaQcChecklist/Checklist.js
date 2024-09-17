import {
  Grid,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  styled,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getQaQcChecklist, updateQaQcChecklist } from "../../../../redux/admin/actions/adminQaQcChecklistActions";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

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
  color: #242424;
  background: #fff;
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

const Checklist = ({ question, index }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [showTextArea, setShowTextArea] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [otherValue, setOtherValue] = useState("");
  const [optionalTextValue, setOptionalTextValue] = useState(
    question?.answer || null
  );

  const lastSubmittedValueRef = useRef(question?.answer || "");

  useEffect(() => {
    if (question?.answer) {
      if (question.question_type === "dropdown") {
        if (question.options.includes(question.answer)) {
          setDropdownValue(question.answer);
        } else {
          setDropdownValue("Other");
          setOtherValue(question.answer);
        }
      } else if (question.question_type === "optional_text") {
        if (question.answer === "NO") {
          setOptionalTextValue("NO");
        } else {
          setOptionalTextValue("YES");
          setTextAreaValue(question.answer);
          setShowTextArea(true);
        }
      } else if (
        question.question_type === "text" ||
        question.question_type === "textInput"
      ) {
        setTextAreaValue(question.answer);
      }
      // Update the lastSubmittedValueRef when the answer changes
      lastSubmittedValueRef.current = question.answer;
    }
  }, [question, dispatch, id]);

  const submitAnswer = (answer) => {
    // Only submit if the answer has changed
    if (answer !== lastSubmittedValueRef.current) {
      let payload = {
        facility_id: id,
        ques_id: question?.question_id,
        answer: answer,
      };

      dispatch(updateQaQcChecklist(payload))
        .then(() => {
          dispatch(getQaQcChecklist(id));
          // Update the lastSubmittedValueRef after successful submission
          lastSubmittedValueRef.current = answer;
        })
        .catch((err) => console.error(err));
    }
  };

  const handleOptionalTextChange = (event, newValue) => {
    // Prevent deselection
    if (newValue !== null) {
      setOptionalTextValue(newValue);

      if (newValue === "YES") {
        setShowTextArea(true);
        // Don't submit anything yet, wait for text input
      } else if (newValue === "NO") {
        setShowTextArea(false);
        setTextAreaValue("");
        submitAnswer("NO");
      }
    }
  };

  const handleToggleChange = (event, newValue) => {
    // Prevent deselection (newValue will be null if trying to deselect)
    if (newValue !== null) {
      submitAnswer(newValue);
    }
  };

  const handleTextAreaBlur = () => {
    if (
      optionalTextValue === "YES" &&
      textAreaValue.trim() !== "" &&
      textAreaValue !== lastSubmittedValueRef.current
    ) {
      submitAnswer(textAreaValue);
    }
  };

  const handleChange = (event, newValue) => {
    let answer = newValue;

    if (question?.question_type === "date") {
      answer = format(newValue, "MM-dd-yyyy");
    } else if (question?.question_type === "dropdown") {
      answer = event.target.value;
      setDropdownValue(answer);
      if (answer !== "Other") {
        setOtherValue("");
      }
    }

    if (question?.question_type !== "dropdown" || answer !== "Other") {
      submitAnswer(answer);
    };
  };

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleOtherChange = (event) => {
    setOtherValue(event.target.value);
  };

  const handleBlur = () => {
    let answer;
    if (
      question?.question_type === "text" ||
      question?.question_type === "textInput"
    ) {
      if (textAreaValue.trim() === "") return;
      answer = textAreaValue;
    } else if (
      question?.question_type === "dropdown" &&
      dropdownValue === "Other"
    ) {
      if (otherValue.trim() === "") return;
      answer = otherValue;
    } else {
      return; // No need to update for other question types on blur
    }

    if (answer !== lastSubmittedValueRef.current) {
      submitAnswer(answer);
    }
  };

  return (
    <Grid
      container
      paddingInline="0.5rem"
      gap={"0.5rem"}
      alignItems="center"
      justifyContent="space-between"
      key={question?.question_id}
    >
      <Grid item xs={12} sm={8.5} md={8.5}>
        <InputLabel
          htmlFor={`question-${question?.question_id}`}
          style={{ whiteSpace: "initial" }}
          sx={{ fontSize: { xs: "14px" } }}
        >
          {index + 1}
          {") "}
          {question?.question}
        </InputLabel>
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <Grid
          container
          direction="column"
          spacing={1}
          sx={{ alignItems: { xs: "flex-start", sm: "flex-end" } }}
        >
          {question?.question_type === "optional" && (
            <Grid item>
              <ToggleButtonGroup
                className="checklist-btn-group"
                id={`question-${question?.question_id}`}
                exclusive
                value={question?.answer || null}
                onChange={handleToggleChange}
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
          {question?.question_type === "date" && (
            <Grid item>
              <DatePicker
                value={question?.answer ? new Date(question.answer) : null}
                onChange={(newValue) => handleChange(null, newValue)}
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
          {question?.question_type === "optional_na" && (
            <Grid item>
              <ToggleButtonGroup
                className="checklist-btn-group"
                id={`question-${question?.question_id}`}
                exclusive
                value={question?.answer || null}
                onChange={handleToggleChange}
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
          {question?.question_type === "optional_text" && (
            <>
              <Grid item>
                <ToggleButtonGroup
                  className="checklist-btn-group"
                  id={`question-${question?.question_id}`}
                  exclusive
                  value={optionalTextValue}
                  onChange={handleOptionalTextChange}
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
                  <TextareaAutosize
                    minRows={3}
                    maxRows={6}
                    style={{ width: "100%", minWidth: "120px" }}
                    value={textAreaValue}
                    onChange={handleTextAreaChange}
                    onBlur={handleTextAreaBlur}
                  />
                </Grid>
              )}
            </>
          )}
          {question?.question_type === "text" && (
            <Grid item>
              <TextareaAutosize
                minRows={3}
                maxRows={6}
                style={{ width: "100%", minWidth: "120px" }}
                value={textAreaValue}
                onChange={handleTextAreaChange}
                onBlur={handleBlur}
              />
            </Grid>
          )}
          {question?.question_type === "textInput" && (
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#242424",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              <TextField
                value={textAreaValue}
                onChange={handleTextAreaChange}
                onBlur={handleBlur}
                onKeyDown={(evt) =>
                  ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
                }
                type="number"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "2rem",
                    fontSize: "1rem",
                  },
                  "& .MuiInputBase-input": {
                    padding: "0.25rem 0.5rem",
                    color: "#242424",
                  },
                }}
              />
              {"years"}
            </Grid>
          )}
          {question?.question_type === "dropdown" && (
            <>
              <Grid item>
                <Select
                  value={dropdownValue}
                  onChange={handleChange}
                  displayEmpty
                  sx={{
                    minWidth: 120,
                    height: "2rem",
                    fontSize: "1rem",
                    "& .MuiSelect-select": {
                      padding: "0.25rem 0.5rem",
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select an option
                  </MenuItem>
                  {question.options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              {dropdownValue === "Other" && (
                <Grid item>
                  <TextField
                    value={otherValue}
                    onChange={handleOtherChange}
                    onBlur={handleBlur}
                    placeholder="Please specify"
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "2rem",
                        fontSize: "1rem",
                      },
                      "& .MuiInputBase-input": {
                        padding: "0.25rem 0.5rem",
                        color: "#242424",
                      },
                    }}
                  />
                </Grid>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Checklist;