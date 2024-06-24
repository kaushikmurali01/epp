import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { headingStyleInAccordion } from "styles/commonStyles";
import { MiniTable } from "components/MiniTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker } from "@mui/x-date-pickers";
import { checkBoxButtonStyle } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { adminSufficiencyCheck } from "../../../../redux/admin/actions/adminBaselineAction";
import {
  COOLING_BALANCE_UNIT_ARRAY,
  HEATING_BALANCE_UNIT_ARRAY,
} from "utils/dropdownConstants/dropdownConstants";
import InputFieldNF from "components/FieldsNotForForms/InputFieldNF";
import SelectBoxNF from "components/FieldsNotForForms/SelectNF";

const ModelConstructorForm = ({ handleSufficiencySettings }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(null);
  const [modelApproachData, setModelApproachData] = useState({
    modelingApproach: "",
    modelApproachAction: "manual",
    heatingBalancePoint: "",
    coolingBalancePoint: "",
    heating_balance_unit: "C",
    cooling_balance_unit: "C",
  });

  console.log(modelApproachData);

  const baselinePeriod = useSelector(
    (state) => state?.adminBaselineReducer?.baselinePeriod
  );
  const independentVariables = useSelector(
    (state) => state?.adminBaselineReducer?.independentVariableList
  );
  const facilityCreatedBy = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.created_by
  );
  const sufficiencyCheckData = useSelector(
    (state) => state?.adminBaselineReducer?.sufficiencyCheckData
  );

  const MODELING_APPROACH_ARRAY = [
    {
      name: "ASHRAE Method- Mean Model",
      extraFields: true,
    },
    { name: "ASHRAE Method- Two Parameter Model", extraFields: true },
    {
      name: "ASHRAE Method- Three Parameter Cooling Model",
      extraFields: true,
    },
    { name: "ASHRAE Method- Three Parameter Heating", extraFields: true },
    { name: "ASHRAE Method- Four Parameter Model", extraFields: true },
    { name: "ASHRAE Method- Five Parameter Model", extraFields: true },
    { name: "ASHRAE Method- Multiple Variable Regression", extraFields: true },
    { name: "CALTRACK Method-TOWT", extraFields: false },
    { name: "GBM Method", extraFields: true },
  ];

  useEffect(() => {
    if (independentVariables) {
      const initialValues = {
        start_date: baselinePeriod.start_date || "",
        end_date: baselinePeriod.end_date || "",
        granularity: baselinePeriod.granularity || "hourly",
        dummyVariables: {
          Hours: false,
          Months: false,
          Years: false,
          Weeks: false,
          Dates: false,
          Weekdays: false,
          Weekdays_hours: false,
        },
        // modelingApproach: "",
      };
      Object.keys(initialValues.dummyVariables).forEach((key) => {
        if (sufficiencyCheckData.hasOwnProperty(key)) {
          initialValues.dummyVariables[key] = sufficiencyCheckData[key];
        }
      });
      independentVariables.forEach((variable) => {
        initialValues[variable.name] = variable.value || false;
      });

      setFormData(initialValues);
    }
  }, [baselinePeriod, independentVariables]);

  const handleSubmit = (values) => {
    console.log(values);
    const myData = {
      ...values,
      facility_id: "24",
      created_by: "163",
    };
    dispatch(adminSufficiencyCheck(myData));
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
      Header: "settings",
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
          onClick={handleSufficiencySettings}
        >
          Sufficiency setting
        </Typography>
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
    <Grid container>
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
                  <MiniTable columns={userColumn} data={[{}]} />
                </Grid>
              </Grid>
              {/* {independentVariables?.length > 0 && ( */}
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
              {/* )} */}
              <Grid item>
                <Typography
                  variant="h6"
                  sx={headingStyleInAccordion}
                  mb={"1rem !important"}
                >
                  Select Dummy variable
                </Typography>
                <Box display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
                  {Object.keys(values.dummyVariables).map((dummyVar) => (
                    <FormGroup key={dummyVar}>
                      <FormControlLabel
                        control={
                          <Field
                            name={`dummyVariables.${dummyVar}`}
                            type="checkbox"
                            as={Checkbox}
                            checked={values.dummyVariables[dummyVar]}
                            onChange={(event) => {
                              setFieldValue(
                                `dummyVariables.${dummyVar}`,
                                event.target.checked
                              );
                              handleSubmit({
                                ...values,
                                dummyVariables: {
                                  ...values.dummyVariables,
                                  [dummyVar]: event.target.checked,
                                },
                              });
                            }}
                          />
                        }
                        sx={{ color: "text.secondary2" }}
                        label={
                          <Typography sx={{ fontSize: "14px!important" }}>
                            {dummyVar}
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
                >
                  <ToggleButton
                    value="hourly"
                    className="theme-toggle-yes"
                    sx={{
                      fontSize: "0.875rem",
                      padding: "2px",
                      textTransform: "capitalize",
                    }}
                  >
                    Hourly
                  </ToggleButton>
                  <ToggleButton
                    value="daily"
                    className="theme-toggle-yes"
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
        )}
      </Formik>
      {/* form ended here */}
      <Grid container mt={5}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={headingStyleInAccordion}>
            Modeling approach
          </Typography>
        </Grid>

        <RadioGroup
          name="modelingApproach"
          value={modelApproachData.modelingApproach}
          onChange={(event) =>
            setModelApproachData({
              ...modelApproachData,
              modelingApproach: event.target.value,
            })
          }
        >
          {MODELING_APPROACH_ARRAY.map((modelType) => (
            <FormControlLabel
              key={modelType.name}
              value={modelType.name}
              control={<Radio />}
              label={
                <Grid
                  sx={{
                    width: "100%",
                    display: "flex",
                    columnGap: "4",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px!important",
                      textWrap: "nowrap!important",
                    }}
                  >
                    {modelType.name}
                  </Typography>
                  {modelApproachData.modelingApproach === modelType.name &&
                    modelType.extraFields && (
                      <Grid
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: { xs: "flex-start", sm: "center" },
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Grid item>
                          <ToggleButtonGroup
                            value={modelApproachData.modelApproachAction}
                            exclusive
                            onChange={(event, newValue) => {
                              if (newValue !== null) {
                                setModelApproachData({
                                  ...modelApproachData,
                                  modelApproachAction: newValue,
                                });
                              }
                            }}
                          >
                            <ToggleButton
                              value="manual"
                              className="theme-toggle-yes"
                              sx={{
                                fontSize: "0.875rem",
                                padding: "2px",
                                textTransform: "capitalize",
                              }}
                            >
                              Manual
                            </ToggleButton>
                            <ToggleButton
                              value="automatic"
                              className="theme-toggle-yes"
                              sx={{
                                fontSize: "0.875rem",
                                padding: "2px",
                                textTransform: "capitalize",
                              }}
                            >
                              Automatic
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <InputFieldNF
                            type="number"
                            name="heatingBalancePoint"
                            label="Heating Balance Point"
                            variant="outlined"
                            value={modelApproachData.heatingBalancePoint}
                            onChange={(event) =>
                              setModelApproachData({
                                ...modelApproachData,
                                heatingBalancePoint: event.target.value,
                              })
                            }
                            InputProps={{
                              endAdornment: (
                                <SelectBoxNF
                                  name="heating_balance_unit"
                                  valueKey="value"
                                  labelKey="label"
                                  value={modelApproachData.heating_balance_unit}
                                  options={HEATING_BALANCE_UNIT_ARRAY}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      fieldset: {
                                        border: "none",
                                      },
                                    },
                                  }}
                                  onChange={(event) =>
                                    setModelApproachData({
                                      ...modelApproachData,
                                      heating_balance_unit: event.target.value,
                                    })
                                  }
                                />
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <InputFieldNF
                            type="number"
                            name="coolingBalancePoint"
                            label="Cooling Balance Point"
                            variant="outlined"
                            value={modelApproachData.coolingBalancePoint}
                            onChange={(event) =>
                              setModelApproachData({
                                ...modelApproachData,
                                coolingBalancePoint: event.target.value,
                              })
                            }
                            InputProps={{
                              endAdornment: (
                                <SelectBoxNF
                                  name="cooling_balance_unit"
                                  valueKey="value"
                                  labelKey="label"
                                  value={modelApproachData.cooling_balance_unit}
                                  options={COOLING_BALANCE_UNIT_ARRAY}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      fieldset: {
                                        border: "none",
                                      },
                                    },
                                  }}
                                  onChange={(event) =>
                                    setModelApproachData({
                                      ...modelApproachData,
                                      cooling_balance_unit: event.target.value,
                                    })
                                  }
                                />
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                </Grid>
              }
            />
          ))}
        </RadioGroup>
      </Grid>

      <Grid container mt={5}>
        <Button variant="contained" color="neutral">
          Calculate baseline
        </Button>
      </Grid>
    </Grid>
  );
};

export default ModelConstructorForm;
