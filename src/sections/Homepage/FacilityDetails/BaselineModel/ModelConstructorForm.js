import {
  Box,
  Button,
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
import React, { useEffect, useRef, useState } from "react";
import { headingStyleInAccordion } from "styles/commonStyles";
import { MiniTable } from "components/MiniTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker } from "@mui/x-date-pickers";
import { checkBoxButtonStyle } from "./styles";
import {
  SufficiencyCheck,
  fetchBaselinePeriod,
  fetchIssueDetails,
} from "../../../../redux/superAdmin/actions/baselineAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const ModelConstructorForm = ({
  openSeeDetails,
  meterType,
  openSendHelpRequestModal,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [baselinePeriodLoading, setBaselinePeriodLoading] = useState(true);
  const [baselinePeriodFailed, setBaselinePeriodFailed] = useState(false);
  const baselinePeriod = useSelector(
    (state) => state?.baselineReducer?.baselinePeriod
  );
  const [baselineStartDate, setBaselineStartDate] = useState("");
  const [baselineEndDate, setBaselineEndDate] = useState("");
  useEffect(() => {
    setBaselinePeriodLoading(true);
    dispatch(fetchBaselinePeriod(24, meterType))
      .then((res) => {
        setBaselinePeriodLoading(false);
        res?.start_date &&
          setBaselineStartDate(format(new Date(res?.start_date), "yyyy-MM-dd"));
        res.end_date &&
          setBaselineEndDate(format(new Date(res?.end_date), "yyyy-MM-dd"));
      })
      .catch((error) => {
        setBaselinePeriodLoading(false);
        if (error) {
          setBaselinePeriodFailed(true);
        }
      });
  }, [id, meterType]);

  const independentVariables = useSelector(
    (state) => state?.baselineReducer?.independentVariableList
  );
  const sufficiencyCheckData = useSelector(
    (state) => state?.baselineReducer?.sufficiencyCheckData
  );

  const meterTypeRef = useRef(meterType);

  useEffect(() => {
    const initialValues = {
      start_date: baselinePeriod?.start_date
        ? new Date(baselinePeriod?.start_date)
        : null,
      end_date: baselinePeriod?.end_date
        ? new Date(baselinePeriod?.end_date)
        : null,
      granularity: "hourly",
      independent_variables: [],
      meter_type: meterType,
    };
    setFormData(initialValues);
  }, [baselinePeriod, meterType]);

  const handleSubmit = (values) => {
    const myData = {
      ...values,
      facility_id: 24,
      start_date:
        values.start_date && format(new Date(values.start_date), "yyyy-MM-dd"),
      end_date:
        values.start_date && format(new Date(values.end_date), "yyyy-MM-dd"),
    };

    dispatch(SufficiencyCheck(myData))
      .then((res) => {
        setBaselinePeriodFailed(false);
        const isFailed = Object.values(res).some(
          (item) => item?.status === "failed"
        );

        if (isFailed) {
          openSendHelpRequestModal();
        }
        if (res?.status === "failed") {
          alert(res?.message);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (meterTypeRef.current !== meterType) {
      setFormData({ ...formData, start_date: null, end_date: null });
      meterTypeRef.current = meterType;
      return;
    }
    if (baselinePeriod?.start_date && baselinePeriod?.end_date) {
      if (formData?.start_date && formData?.end_date) {
        handleSubmit(formData);
      }
    }
  }, [formData, baselinePeriod?.start_date, baselinePeriod?.end_date]);

  const sufficiencyVerificationStatusButton = (status) => {
    return status === "passed" ? (
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
  };

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
      accessor: (item) =>
        sufficiencyVerificationStatusButton(item?.hourly?.status),
    },
    {
      Header: "Daily",
      accessor: (item) =>
        sufficiencyVerificationStatusButton(item?.daily?.status),
    },
    {
      Header: "Monthly",
      accessor: (item) =>
        sufficiencyVerificationStatusButton(
          item?.hourly?.status === "failed" || item?.daily?.status === "failed"
            ? "failed"
            : "passed"
        ),
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
          onClick={() => {
            openSeeDetails(baselineStartDate, baselineEndDate);
          }}
          disabled={sufficiencyCheckData.status === "failed"}
        >
          See details
        </Typography>
      ),
    },
  ];

  if (
    (baselinePeriod?.start_date === null &&
      baselinePeriod?.end_date === null) ||
    baselinePeriodLoading
  ) {
    return (
      <Grid>
        <Grid item xs={12}>
          {baselinePeriodLoading ? (
            <Typography
              variant="h6"
              sx={{ marginTop: "2rem", marginBottom: "2rem" }}
            >
              Fetching baseline period information, Please wait...
            </Typography>
          ) : (
            <Typography
              variant="h6"
              sx={{
                marginTop: "2rem",
                marginBottom: "2rem",
                color: "#FF5858",
              }}
            >
              Insufficient data, please upload sufficient data then try again
              later.
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }

  if (baselinePeriodFailed) {
    return (
      <Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{
              marginTop: "2rem",
              marginBottom: "2rem",
              color: "#FF5858",
            }}
          >
            Insufficient data or there was some error while fetching baseline
            period information, please try again later!
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container>
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, handleChange, setFieldValue, errors }) => {
          const handleIndeVarCheckboxChange = (variableItem, event) => {
            const isChecked = event.target.checked;
            const newIndependentVariables = isChecked
              ? [...values.independent_variables, variableItem.id]
              : values.independent_variables.filter(
                  (id) => id !== variableItem.id
                );
            setFieldValue("independent_variables", newIndependentVariables);
            handleSubmit({
              ...values,
              independent_variables: newIndependentVariables,
            });
          };

          return (
            <Form>
              <Grid container display={"grid"} gap={"2rem"}>
                <Grid item>
                  <Typography variant="h6" sx={headingStyleInAccordion}>
                    Baseline period
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
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
                        minDate={new Date(baselinePeriod?.start_date)}
                        maxDate={new Date(baselinePeriod?.end_date)}
                        value={values.start_date}
                        onChange={(date) => {
                          setFieldValue("start_date", date);
                          handleSubmit({ ...values, start_date: date });
                          setBaselineStartDate(
                            format(new Date(date), "yyyy-MM-dd")
                          );
                        }}
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
                    <Grid item xs={12} sm={4}>
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
                          setBaselineEndDate(
                            format(new Date(date), "yyyy-MM-dd")
                          );
                        }}
                        minDate={new Date(baselinePeriod?.start_date)}
                        maxDate={new Date(baselinePeriod?.end_date)}
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
                <Grid item sx={{ overflowX: "scroll" }}>
                  <Typography variant="h6" sx={headingStyleInAccordion}>
                    Sufficiency verification
                  </Typography>
                  <Grid item>
                    <MiniTable
                      columns={userColumn}
                      data={[sufficiencyCheckData]}
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
                              name={`independent_variables.${variableItem?.name}`}
                              type="checkbox"
                              as={Checkbox}
                              checked={
                                values.independent_variables[variableItem?.name]
                              }
                              onChange={(event) =>
                                handleIndeVarCheckboxChange(variableItem, event)
                              }
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
              </Grid>
            </Form>
          );
        }}
      </Formik>
      <Grid container mt={5}>
        <Button variant="contained" color="neutral">
          Calculate baseline
        </Button>
      </Grid>
    </Grid>
  );
};

export default ModelConstructorForm;
