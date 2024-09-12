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
  fetchAdminBaselineDetailsFromDb,
  fetchAdminBaselinePeriod,
  submitAdminBaselineDt,
  updateAdminBaselineInDb,
} from "../../../../redux/admin/actions/adminBaselineAction";
import {
  COOLING_BALANCE_UNIT_ARRAY,
  HEATING_BALANCE_UNIT_ARRAY,
} from "utils/dropdownConstants/dropdownConstants";
import InputFieldNF from "components/FieldsNotForForms/InputFieldNF";
import SelectBoxNF from "components/FieldsNotForForms/SelectNF";
import { format, isAfter, subYears } from "date-fns";
import { useParams } from "react-router-dom";
import { getSummaryDataByMeterType } from ".";
import DateRangeSlider from "components/DateRangeSlider";
import Loader from "pages/Loader";

const ModelConstructorForm = ({
  handleSufficiencySettings,
  openSeeDetails,
  meterType,
  openUserReviewBaselineModal,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [modelApproachData, setModelApproachData] = useState({
    modeling_approach: "CALTRACK Method-TOWT",
    model_approach_action: "manual",
    heating_balance_point: "",
    cooling_balance_point: "",
    heating_balance_unit: "",
    cooling_balance_unit: "",
  });
  const [dummyVariables, setDummyVariables] = useState({
    Hours: false,
    Months: false,
    Years: false,
    Weeks: false,
    Dates: false,
    Weekdays: false,
    Weekdays_hours: false,
  });
  const [baselinePeriod, setBaselinePeriod] = useState(null);
  const [baselinePeriodLoading, setBaselinePeriodLoading] = useState(true);
  const [baselinePeriodFailed, setBaselinePeriodFailed] = useState(false);
  const [baselineStartDate, setBaselineStartDate] = useState("");
  const [baselineEndDate, setBaselineEndDate] = useState("");
  const [activateCalculateBaseline, setActivateCalculateBaseline] =
    useState(true);
  const [disableSeeDetails, setDisableSeeDetails] = useState(false);
  const [dataForCalculateBaseline, setDateForCalculateBaseline] = useState("");
  const baselineListData = useSelector(
    (state) => state?.adminBaselineReducer?.baselineDetailsDb?.data || []
  );
  const calculateBaselineLoading = useSelector(
    (state) => state?.adminBaselineReducer?.calculateBaselineLoading
  );
  const [checkSufficiencyAfter, setCheckSufficiencyAfter] = useState(false);
  const [sufficiencyCheckDataLocally, setSufficiencyCheckDataLocally] =
    useState(null);
  const [sliderStartDate, setSliderStartDate] = useState(null);
  const [sliderEndDate, setSliderEndDate] = useState(null);
  const [errorStatusMessage, setErrorStatusMessage] = useState("");
  const [modelText, setModelText] = useState("hourly");

  useEffect(() => {
    setBaselinePeriodLoading(true);
    setBaselinePeriodFailed(false);
    dispatch(fetchAdminBaselinePeriod(id, meterType))
      .then((res) => {
        setBaselinePeriodLoading(false);
        setBaselinePeriod(res);
        if (res?.end_date && res?.start_date) {
          const endDate = format(new Date(res?.end_date), "yyyy-MM-dd");
          let startDate = format(new Date(subYears(endDate, 1)), "yyyy-MM-dd");
          const apiStartDate = format(new Date(res?.start_date), "yyyy-MM-dd");
          if (isAfter(apiStartDate, startDate)) {
            startDate = apiStartDate;
          }
          setSliderStartDate(startDate);
          setSliderEndDate(endDate);
        }
      })
      .catch((error) => {
        setBaselinePeriodLoading(false);
        if (error) {
          if (error?.response?.status === 404) {
            setErrorStatusMessage(error?.response?.data?.error);
          } else setErrorStatusMessage("");
          setBaselinePeriodFailed(true);
        }
      });
  }, [id, meterType, dispatch]);

  const independentVariables = useSelector(
    (state) => state?.adminBaselineReducer?.independentVariableList
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
    const baselineCalculated = getSummaryDataByMeterType(
      baselineListData,
      meterType
    );
    if (
      baselineCalculated?.status === "SUBMITTED" ||
      (baselineCalculated?.status === "REQUESTED" &&
        baselineCalculated?.parameter_data?.length > 0)
    ) {
      setCheckSufficiencyAfter(true);
      setFormData({
        ...baselineCalculated?.parameter_data,
        start_date: format(
          new Date(baselineCalculated?.parameter_data?.start_date),
          "yyyy-MM-dd"
        ),
        end_date: format(
          new Date(baselineCalculated?.parameter_data?.end_date),
          "yyyy-MM-dd"
        ),
      });
      const submittedDummyVariables = baselineCalculated?.parameter_data
        ?.dummyVariables || {
        Hours: false,
        Months: false,
        Years: false,
        Weeks: false,
        Dates: false,
        Weekdays: false,
        Weekdays_hours: false,
      };
      setDummyVariables(submittedDummyVariables);
      setSufficiencyCheckDataLocally({
        daily: { ...baselineCalculated?.parameter_data?.daily },
        hourly: { ...baselineCalculated?.parameter_data?.hourly },
        monthly: { ...baselineCalculated?.parameter_data?.monthly },
      });
      setBaselineStartDate(
        format(
          new Date(baselineCalculated?.parameter_data?.start_date),
          "yyyy-MM-dd"
        )
      );
      setBaselineEndDate(
        format(
          new Date(baselineCalculated?.parameter_data?.end_date),
          "yyyy-MM-dd"
        )
      );
    } else {
      setCheckSufficiencyAfter(false);
      const initialValues = {
        start_date: sliderStartDate,
        end_date: sliderEndDate,
        granularity: "hourly",
        weatherStation: formData?.weatherStation || "",
        independent_variables: [],
        meter_type: meterType,
      };
      const initialDummyVariables = {
        Hours: false,
        Months: false,
        Years: false,
        Weeks: false,
        Dates: false,
        Weekdays: false,
        Weekdays_hours: false,
      };
      Object.keys(initialDummyVariables).forEach((key) => {
        if (sufficiencyCheckData.hasOwnProperty(key)) {
          initialDummyVariables[key] = sufficiencyCheckData[key];
        }
      });

      setFormData(initialValues);
      setDummyVariables(initialDummyVariables);
    }
  }, [baselinePeriod, meterType, sliderStartDate, sliderEndDate]);

  const handleSubmit = (values) => {
    const myData = {
      ...values,
      facility_id: id,
      start_date:
        values.start_date && format(new Date(values.start_date), "yyyy-MM-dd"),
      end_date:
        values.start_date && format(new Date(values.end_date), "yyyy-MM-dd"),
    };
    setActivateCalculateBaseline(true);
    setCheckSufficiencyAfter(false);
    setDisableSeeDetails(false);
    dispatch(adminSufficiencyCheck(myData))
      .then((res) => {
        setBaselinePeriodFailed(false);
        setActivateCalculateBaseline(false);
        setDateForCalculateBaseline(myData);
        const isFailed = Object.values(res).some(
          (item) => item?.status === "failed"
        );

        if (isFailed) {
          setActivateCalculateBaseline(true);
        }
        if (res?.status === "failed") {
          alert(res?.message);
          setActivateCalculateBaseline(true);
        }
      })
      .catch((error) => {
        setActivateCalculateBaseline(true);
        setDisableSeeDetails(true);
      });
  };

  const updateDummyVariables = (updatedDummyVariables) => {
    setDummyVariables(updatedDummyVariables);
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

  const handleModelingApproachChange = (event) => {
    const newApproach = event.target.value;
    setModelApproachData({
      modeling_approach: newApproach,
      model_approach_action: "manual",
      heating_balance_point: "",
      cooling_balance_point: "",
      heating_balance_unit: "",
      cooling_balance_unit: "",
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
      Header: "Hourly",
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
        sufficiencyVerificationStatusButton(item?.monthly?.status),
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
            openSeeDetails(
              checkSufficiencyAfter ? sufficiencyCheckDataLocally : null,
              baselineStartDate ? baselineStartDate : sliderStartDate,
              baselineEndDate ? baselineEndDate : sliderEndDate
            );
          }}
          disabled={disableSeeDetails}
        >
          See details
        </Typography>
      ),
    },
  ];

  if (baselinePeriodLoading) {
    return (
      <Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ marginTop: "2rem", marginBottom: "2rem" }}
          >
            Fetching baseline period information, Please wait...
          </Typography>
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
            {errorStatusMessage
              ? errorStatusMessage
              : `There was some error while fetching baseline
            period information, please try again later!`}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  const getIdByMeterType = (meter_type) => {
    const meter = getSummaryDataByMeterType(baselineListData, meter_type);
    return meter ? meter?.id : null;
  };

  const onCalculateBaselineButtonClick = () => {
    const data = {
      ...dataForCalculateBaseline,
      ...modelApproachData,
      dummyVariables: dummyVariables,
    };
    dispatch(submitAdminBaselineDt(data))
      .then((res) => {
        const updatedBaselineData = {
          status: "REVIEWED",
          data: {
            ...data,
            ...res,
            ...sufficiencyCheckData,
          },
        };

        const baseline_id = getIdByMeterType(meterType);
        if (baseline_id) {
          openUserReviewBaselineModal(baseline_id, updatedBaselineData);
        }
        setActivateCalculateBaseline(true);
      })
      .catch((err) => {});
  };

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

          const handleDateRangeChange = (startDate, endDate) => {
            setFieldValue("start_date", startDate);
            setFieldValue("end_date", endDate);
            handleSubmit({
              ...values,
              start_date: startDate,
              end_date: endDate,
            });
            setBaselineStartDate(startDate);
            setBaselineEndDate(endDate);
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
                  <Grid
                    container
                    mt={10}
                    fullWidth={true}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DateRangeSlider
                      start_date={format(
                        new Date(baselinePeriod?.start_date),
                        "yyyy-MM-dd"
                      )}
                      end_date={format(
                        new Date(baselinePeriod?.end_date),
                        "yyyy-MM-dd"
                      )}
                      sliderStartDate={values?.start_date}
                      sliderEndDate={values?.end_date}
                      startLabel="Baseline Start"
                      endLabel="Baseline End"
                      onChange={handleDateRangeChange}
                    />
                    {(errors.start_date || errors.end_date) && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "0.75rem",
                          marginTop: "8px",
                        }}
                      >
                        {errors.start_date || errors.end_date}
                      </div>
                    )}
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
                        data={
                          checkSufficiencyAfter && sufficiencyCheckDataLocally
                            ? [sufficiencyCheckDataLocally]
                            : [sufficiencyCheckData]
                        }
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
                          key={station?.station_id}
                          value={station?.station_id}
                          control={<Radio />}
                          label={
                            <Typography sx={{ fontSize: "14px!important" }}>
                              {station?.station_name}
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
                              // checked={
                              //   values.independent_variables[variableItem?.name]
                              // }
                              checked={
                                +values?.independent_variables?.includes(
                                  +variableItem?.id
                                )
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
                    {Object.keys(dummyVariables).map((dummyVar) => (
                      <FormGroup key={dummyVar}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={dummyVariables[dummyVar]}
                              onChange={(event) => {
                                const updatedDummyVariables = {
                                  ...dummyVariables,
                                  [dummyVar]: event.target.checked,
                                };
                                updateDummyVariables(updatedDummyVariables);
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
                        setModelText(value);
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
              disabled
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
        <Button
          variant="contained"
          color="neutral"
          onClick={onCalculateBaselineButtonClick}
          disabled={activateCalculateBaseline}
        >
          Calculate baseline
        </Button>
      </Grid>
      <Loader
        textLoader={calculateBaselineLoading}
        sectionLoader
        minHeight="100vh"
        loadingState={calculateBaselineLoading}
        loaderPosition="fixed"
        customLoaderText={`The baseline modeling process has started with ${modelText} regressions. Please wait while the calculation is underway. You’ll be notified once the best baseline model is established.`}
      />
    </Box>
  );
};

export default ModelConstructorForm;
