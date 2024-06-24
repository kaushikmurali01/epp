import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ButtonWrapper from "components/FormBuilder/Button";
import { headingStyleInAccordion } from "styles/commonStyles";
import { MiniTable } from "components/MiniTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker } from "@mui/x-date-pickers";
import { checkBoxButtonStyle } from "./styles";
import { SufficiencyCheck } from "../../../../redux/superAdmin/actions/baselineAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ModelConstructorForm = ({ meterType }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);

  const baselinePeriod = useSelector(
    (state) => state?.baselineReducer?.baselinePeriod
  );
  const independentVariables = useSelector(
    (state) => state?.baselineReducer?.independentVariableList
  );
  const facilityCreatedBy = useSelector(
    (state) => state?.facilityReducer?.facilityDetails?.data?.created_by
  );
  const sufficiencyCheckData = useSelector(
    (state) => state?.baselineReducer?.sufficiencyCheckData
  );
  useEffect(() => {
    if (independentVariables) {
      const initialValues = {
        start_date: baselinePeriod.start_date || "",
        end_date: baselinePeriod.end_date || "",
        granularity: baselinePeriod.granularity || "hourly",
      };

      independentVariables.forEach((variable) => {
        initialValues[variable.name] = variable.value || false;
      });

      setFormData(initialValues);
    }
  }, [baselinePeriod, independentVariables]);

  const handleSubmit = (values) => {
    const myData = {
      ...values,
      facility_id: id,
      created_by: facilityCreatedBy,
    };
    dispatch(SufficiencyCheck(myData));
  };

  useEffect(() => {
    if (formData) {
      handleSubmit(formData);
    }
  }, [formData]);

  const sufficiencyVerificationStatusButton = false ? (
    <Typography
      variant="span"
      sx={{
        ...checkBoxButtonStyle,
        border: "0.5px solid #2e813e",
        color: "primary.main",
      }}
    >
      <CheckCircleIcon /> Verify
    </Typography>
  ) : (
    <Typography
      variant="span"
      sx={{
        ...checkBoxButtonStyle,
        border: "0.5px solid #FF5858",
        color: "danger.main",
      }}
    >
      <CancelIcon /> Failed
    </Typography>
  );

  const userColumn = [
    {
      Header: "id",
      headerVisibility: "hidden",
      accessor: (item) => (
        <Typography
          variant="span"
          sx={{
            color: "primary.main",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          Sufficiency verification
        </Typography>
      ),
    },
    {
      Header: "hourly",
      accessor: (item) => sufficiencyVerificationStatusButton,
    },
    {
      Header: "Monthly",
      accessor: (item) => sufficiencyVerificationStatusButton,
    },
    {
      Header: "Daily",
      accessor: (item) => sufficiencyVerificationStatusButton,
    },
    {
      Header: "details",
      headerVisibility: "hidden",
      accessor: (item) => (
        <Typography
          variant="span"
          sx={{
            cursor: "pointer",
            color: "primary.main",
            fontSize: "0.875rem !important",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          See details
        </Typography>
      ),
    },
  ];

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={formData}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, handleChange, setFieldValue, errors }) => (
        <Form>
          <Grid container display={"grid"} gap={"2rem"}>
            <Grid item>
              <Typography variant="h6" sx={headingStyleInAccordion}>
                Baseline period
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={4}>
                  <InputLabel
                    htmlFor="start_date"
                    style={{ whiteSpace: "initial" }}
                  >
                    Baseline start *
                  </InputLabel>
                  <DatePicker
                    id="start_date"
                    name="start_date"
                    sx={{
                      width: "100%",
                      input: { color: "#111" },
                    }}
                    value={values.start_date}
                    onChange={(date) => {
                      setFieldValue("start_date", date);
                      handleSubmit({ ...values, start_date: date });
                    }}
                    disableFuture
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        helperText: errors.start_date && errors.start_date,
                      },
                      actionBar: {
                        actions: ["clear", "accept"],
                        className: "my-datepicker-actionbar",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel
                    htmlFor="end_date"
                    style={{ whiteSpace: "initial" }}
                  >
                    Baseline end *
                  </InputLabel>
                  <DatePicker
                    id="end_date"
                    name="end_date"
                    sx={{
                      width: "100%",
                      input: { color: "#111" },
                    }}
                    value={values.end_date}
                    onChange={(date) => {
                      setFieldValue("end_date", date);
                      handleSubmit({ ...values, end_date: date });
                    }}
                    disableFuture
                    minDate={values?.start_date}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        helperText: errors.end_date && errors.end_date,
                      },
                      actionBar: {
                        actions: ["clear", "accept"],
                        className: "my-datepicker-actionbar",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={headingStyleInAccordion}>
                Sufficiency verification
              </Typography>
              <Grid item>
                <MiniTable
                  columns={userColumn}
                  // data={
                  //   meterType === 2
                  //     ? sufficiencyCheckData?.["2"]
                  //     : sufficiencyCheckData?.["3"]
                  // }
                  data={[{}]}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                sx={headingStyleInAccordion}
                mb={"1rem !important"}
              >
                Baseline independent variable
              </Typography>
              <Box display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
                {independentVariables?.map((variableItem) => (
                  <FormGroup key={variableItem?.name}>
                    <FormControlLabel
                      control={
                        <Field
                          name={variableItem?.name}
                          type="checkbox"
                          as={Checkbox}
                          checked={values[variableItem?.name]}
                          onChange={(event) => {
                            setFieldValue(
                              variableItem?.name,
                              event.target.checked
                            );
                            handleSubmit({
                              ...values,
                              [variableItem?.name]: event.target.checked,
                            });
                          }}
                        />
                      }
                      sx={{ color: "text.secondary2" }}
                      label={
                        <Typography sx={{ fontSize: "14px!important" }}>
                          {variableItem?.name}
                        </Typography>
                      }
                    />
                  </FormGroup>
                ))}
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="h6" sx={headingStyleInAccordion}>
                Model granularity
              </Typography>
              <ToggleButtonGroup
                value={values.granularity}
                exclusive
                onChange={(e, value) => {
                  if (value !== null) {
                    setFieldValue("granularity", value);
                    handleSubmit({ ...values, granularity: value });
                  }
                }}
                aria-label="text alignment"
                disabled
              >
                <ToggleButton
                  className="theme-toggle-yes"
                  value="hourly"
                  sx={{
                    fontSize: "0.875rem",
                    padding: "2px",
                    textTransform: "capitalize",
                  }}
                >
                  Hourly
                </ToggleButton>
                <ToggleButton
                  className="theme-toggle-yes"
                  value="daily"
                  sx={{
                    fontSize: "0.875rem",
                    padding: "2px",
                    textTransform: "capitalize",
                  }}
                >
                  Daily
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid>
              <ButtonWrapper type="submit" color="neutral">
                Calculate baseline
              </ButtonWrapper>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ModelConstructorForm;
