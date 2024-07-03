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
import React, { useEffect, useRef, useState } from "react";
import { headingStyleInAccordion } from "styles/commonStyles";
import { MiniTable } from "components/MiniTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker } from "@mui/x-date-pickers";
import { checkBoxButtonStyle } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import {
  adminSufficiencyCheck,
  fetchAdminBaselinePeriod,
} from "../../../../redux/admin/actions/adminBaselineAction";
import {
  COOLING_BALANCE_UNIT_ARRAY,
  HEATING_BALANCE_UNIT_ARRAY,
} from "utils/dropdownConstants/dropdownConstants";
import InputFieldNF from "components/FieldsNotForForms/InputFieldNF";
import SelectBoxNF from "components/FieldsNotForForms/SelectNF";
import EvModal from "utils/modal/EvModal";
import SeeSufficiencyDetails from "./SeeSufficiencyDetails";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const ModelConstructorForm = ({
  handleSufficiencySettings,
  openSeeDetails,
  openSendHelpRequestModal,
  meterType,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [modelApproachData, setModelApproachData] = useState({
    modeling_approach: "",
    model_approach_action: "manual",
    heating_balance_point: "",
    cooling_balance_point: "",
    heating_balance_unit: "C",
    cooling_balance_unit: "C",
  });
  const [baselinePeriodLoading, setBaselinePeriodLoading] = useState(true);
  const [baselinePeriodFailed, setBaselinePeriodFailed] = useState(false);
  const baselinePeriod = useSelector(
    (state) => state?.adminBaselineReducer?.baselinePeriod
  );
  const [baselineStartDate, setBaselineStartDate] = useState("");
  const [baselineEndDate, setBaselineEndDate] = useState("");

  useEffect(() => {
    setBaselinePeriodLoading(true);
    dispatch(fetchAdminBaselinePeriod(24, meterType))
      .then((res) => {
        setBaselinePeriodLoading(false);
        res?.min_date &&
          setBaselineStartDate(format(new Date(res?.min_date), "yyyy-MM-dd"));
        res.max_date &&
          setBaselineEndDate(format(new Date(res?.max_date), "yyyy-MM-dd"));
      })
      .catch((error) => {
        setBaselinePeriodLoading(false);
        if (error) {
          setBaselinePeriodFailed(true);
        }
      });
  }, [id, meterType]);

  const independentVariables = useSelector(
    (state) => state?.adminBaselineReducer?.independentVariableList
  );
  const facilityCreatedBy = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.created_by
  );
  const sufficiencyCheckData = useSelector(
    (state) => state?.adminBaselineReducer?.sufficiencyCheckData
  );
  const weatherStationsData = useSelector(
    (state) => state?.adminBaselineReducer?.stationDetails
  );
  const meterTypeRef = useRef(meterType);

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
    const initialValues = {
      min_date: baselinePeriod?.min_date
        ? new Date(baselinePeriod?.min_date)
        : null,
      max_date: baselinePeriod?.max_date
        ? new Date(baselinePeriod?.max_date)
        : null,
      granularity: "hourly",
      dummyVariables: {
        Hours: false,
        Months: false,
        Years: false,
        Weeks: false,
        Dates: false,
        Weekdays: false,
        Weekdays_hours: false,
      },
      weatherStation: formData?.weatherStation || "",
      independent_variables: [],
      meter_type: meterType,
    };
    Object.keys(initialValues.dummyVariables).forEach((key) => {
      if (sufficiencyCheckData.hasOwnProperty(key)) {
        initialValues.dummyVariables[key] = sufficiencyCheckData[key];
      }
    });

    setFormData(initialValues);
  }, [baselinePeriod, meterType]);

  const handleSubmit = (values) => {
    const myData = {
      ...values,
      facility_id: 24,
      min_date:
        values.min_date && format(new Date(values.min_date), "yyyy-MM-dd"),
      max_date:
        values.min_date && format(new Date(values.max_date), "yyyy-MM-dd"),
    };
    dispatch(adminSufficiencyCheck(myData)).then((res) => {
      const isFailed = Object.values(res).some(
        (item) => item?.status === "failed"
      );

      if (isFailed) {
        openSendHelpRequestModal();
      }
      // if (res.hasOwnProperty("error")) {
      //   setBaselinePeriodFailed(true);
      // }
    });
  };

  useEffect(() => {
    if (meterTypeRef.current !== meterType) {
      setFormData({ ...formData, min_date: null, max_date: null });
      meterTypeRef.current = meterType;
      return;
    }
    if (baselinePeriod?.min_date && baselinePeriod?.max_date) {
      if (formData?.min_date && formData?.max_date) {
        handleSubmit(formData);
      }
    }
  }, [formData, baselinePeriod?.min_date, baselinePeriod?.max_date]);

  const handleModelingApproachChange = (event) => {
    const newApproach = event.target.value;
    setModelApproachData({
      modeling_approach: newApproach,
      model_approach_action: "manual",
      heating_balance_point: "",
      cooling_balance_point: "",
      heating_balance_unit: "C",
      cooling_balance_unit: "C",
    });
  };

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
      Header: "Monthly",
      accessor: (item) =>
        sufficiencyVerificationStatusButton(item?.monthly?.status),
    },
    {
      Header: "Daily",
      accessor: (item) =>
        sufficiencyVerificationStatusButton(item?.daily?.status),
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
          onClick={() => {
            openSeeDetails(baselineStartDate, baselineEndDate);
          }}
        >
          See details
        </Typography>
      ),
    },
  ];

  if (
    (baselinePeriod?.min_date === null && baselinePeriod?.max_date === null) ||
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
            There was some error while fetching baseline period information,
            please try again later!
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        padding: "0 2rem",
      }}
    >
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
              <Grid container rowGap={4}>
                <Grid container spacing={4}>
                  <Grid container mt={4}>
                    <Typography variant="h6" sx={headingStyleInAccordion}>
                      Baseline period
                    </Typography>
                  </Grid>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                      <InputLabel
                        htmlFor="min_date"
                        style={{ whiteSpace: "initial" }}
                      >
                        Baseline start *
                      </InputLabel>
                      <DatePicker
                        id="min_date"
                        name="min_date"
                        sx={{
                          width: "100%",
                          input: { color: "#111" },
                        }}
                        minDate={new Date(baselinePeriod?.min_date)}
                        maxDate={new Date(baselinePeriod?.max_date)}
                        value={values.min_date}
                        onChange={(date) => {
                          setFieldValue("min_date", date);
                          handleSubmit({ ...values, min_date: date });
                          setBaselineStartDate(
                            format(new Date(date), "yyyy-MM-dd")
                          );
                        }}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            helperText: errors.min_date && errors.min_date,
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
                        htmlFor="max_date"
                        style={{ whiteSpace: "initial" }}
                      >
                        Baseline end *
                      </InputLabel>
                      <DatePicker
                        id="max_date"
                        name="max_date"
                        sx={{
                          width: "100%",
                          input: { color: "#111" },
                        }}
                        value={values.max_date}
                        onChange={(date) => {
                          setFieldValue("max_date", date);
                          handleSubmit({ ...values, max_date: date });
                          setBaselineEndDate(
                            format(new Date(date), "yyyy-MM-dd")
                          );
                        }}
                        minDate={new Date(baselinePeriod?.min_date)}
                        maxDate={new Date(baselinePeriod?.max_date)}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            helperText: errors.max_date && errors.max_date,
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

                <Grid container spacing={4}>
                  <Grid container mt={4}>
                    <Typography variant="h6" sx={headingStyleInAccordion}>
                      Sufficiency verification
                    </Typography>
                  </Grid>
                  <Grid>
                    <Box>
                      <MiniTable
                        columns={userColumn}
                        data={[sufficiencyCheckData]}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={4}>
                  <Grid container mt={4}>
                    <Typography variant="h6" sx={headingStyleInAccordion}>
                      Weather Station
                    </Typography>
                  </Grid>

                  <Grid container>
                    <RadioGroup
                      name="weatherStation"
                      value={values.weatherStation}
                      onChange={(event) => {
                        setFieldValue("weatherStation", event.target.value);
                        handleSubmit({
                          ...values,
                          weatherStation: event.target.value,
                        });
                      }}
                    >
                      {weatherStationsData?.map((station) => (
                        <FormControlLabel
                          key={station}
                          value={station}
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              {station}
                            </Typography>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </Grid>
                </Grid>
                {/* {independentVariables?.length > 0 && ( */}
                <Grid container spacing={4}>
                  <Grid container mt={4}>
                    <Typography
                      variant="h6"
                      sx={headingStyleInAccordion}
                      mb={"1rem !important"}
                    >
                      Baseline independent variable
                    </Typography>
                  </Grid>

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
                {/* )} */}
                <Grid container spacing={4}>
                  <Grid container mt={4}>
                    <Typography
                      variant="h6"
                      sx={headingStyleInAccordion}
                      mb={"1rem !important"}
                    >
                      Select Dummy variable
                    </Typography>
                  </Grid>
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
                <Grid container spacing={4}>
                  <Grid container mt={4}>
                    <Typography variant="h6" sx={headingStyleInAccordion}>
                      Model granularity
                    </Typography>
                  </Grid>
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
          );
        }}
      </Formik>
      {/* form ended here */}
      <Grid container spacing={4} mt={4}>
        <Grid container>
          <Typography variant="h6" sx={headingStyleInAccordion}>
            Modeling approach
          </Typography>
        </Grid>

        <RadioGroup
          name="modeling_approach"
          value={modelApproachData.modeling_approach}
          onChange={handleModelingApproachChange}
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
                      // textWrap: "nowrap!important",
                    }}
                  >
                    {modelType.name}
                  </Typography>
                  {modelApproachData.modeling_approach === modelType.name &&
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
                            value={modelApproachData.model_approach_action}
                            exclusive
                            onChange={(event, newValue) => {
                              if (newValue !== null) {
                                setModelApproachData({
                                  ...modelApproachData,
                                  model_approach_action: newValue,
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
                            name="heating_balance_point"
                            label="Heating Balance Point"
                            variant="outlined"
                            value={modelApproachData.heating_balance_point}
                            onChange={(event) =>
                              setModelApproachData({
                                ...modelApproachData,
                                heating_balance_point: event.target.value,
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
                            name="cooling_balance_point"
                            label="Cooling Balance Point"
                            variant="outlined"
                            value={modelApproachData.cooling_balance_point}
                            onChange={(event) =>
                              setModelApproachData({
                                ...modelApproachData,
                                cooling_balance_point: event.target.value,
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
    </Box>
  );
};

export default ModelConstructorForm;
