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
import { checkBoxButtonStyle } from "./styles";
import {
  SufficiencyCheck,
  addBaselineToDb,
  fetchBaselineDetailsFromDb,
  fetchBaselinePeriod,
  submitBaselineDt,
  updateBaselineInDb,
} from "../../../../redux/superAdmin/actions/baselineAction";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format, isAfter, isBefore, max, parseISO, subYears } from "date-fns";
import { getSummaryDataByMeterType } from ".";
import DateRangeSlider from "components/DateRangeSlider";

const ModelConstructorForm = ({
  openSeeDetails,
  meterType,
  openSendHelpRequestModal,
  openBaselineSuccessModal,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [baselinePeriod, setBaselinePeriod] = useState(null);
  const [baselinePeriodLoading, setBaselinePeriodLoading] = useState(true);
  const [baselinePeriodFailed, setBaselinePeriodFailed] = useState(false);
  const [baselineStartDate, setBaselineStartDate] = useState("");
  const [baselineEndDate, setBaselineEndDate] = useState("");
  const [activateCalculateBaseline, setActivateCalculateBaseline] =
    useState(true);
  const [disableSeeDetails, setDisableSeeDetails] = useState(false);
  const [checkSufficiencyAfter, setCheckSufficiencyAfter] = useState(false);
  const [sufficiencyCheckDataLocally, setSufficiencyCheckDataLocally] =
    useState(null);
  const [dataForCalculateBaseline, setDateForCalculateBaseline] = useState("");
  const baselineListData = useSelector(
    (state) => state?.baselineReducer?.baselineDetailsDb?.data || []
  );
  const [sliderStartDate, setSliderStartDate] = useState(null);
  const [sliderEndDate, setSliderEndDate] = useState(null);
  const [errorStatusMessage, setErrorStatusMessage] = useState("");

  useEffect(() => {
    setBaselinePeriodLoading(true);
    setBaselinePeriodFailed(false);
    dispatch(fetchBaselinePeriod(id, meterType))
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
    (state) => state?.baselineReducer?.independentVariableList
  );
  const sufficiencyCheckData = useSelector(
    (state) => state?.baselineReducer?.sufficiencyCheckData
  );

  const meterTypeRef = useRef(meterType);

  useEffect(() => {
    const baselineCalculated = getSummaryDataByMeterType(
      baselineListData,
      meterType
    );
    if (
      baselineCalculated?.status === "CALCULATED" ||
      baselineCalculated?.status === "SUBMITTED"
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
        independent_variables: [],
        meter_type: meterType,
      };
      setFormData(initialValues);
    }
  }, [baselinePeriod, meterType, sliderStartDate, sliderEndDate]);

  const handleSubmit = (values) => {
    const myData = {
      ...values,
      facility_id: id,
      start_date:
        values.start_date && format(new Date(values.start_date), "yyyy-MM-dd"),
      end_date:
        values.end_date && format(new Date(values.end_date), "yyyy-MM-dd"),
    };
    setActivateCalculateBaseline(true);
    setCheckSufficiencyAfter(false);
    setDisableSeeDetails(false);
    dispatch(SufficiencyCheck(myData))
      .then((res) => {
        setBaselinePeriodFailed(false);
        setActivateCalculateBaseline(false);
        setDateForCalculateBaseline(myData);
        const isFailed = Object.values(res).some(
          (item) => item?.status === "failed"
        );

        if (isFailed) {
          openSendHelpRequestModal();
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

  useEffect(() => {
    if (meterTypeRef.current !== meterType) {
      setFormData({ ...formData, start_date: null, end_date: null });
      meterTypeRef.current = meterType;
      return;
    }
    if (
      !checkSufficiencyAfter &&
      baselinePeriod?.start_date &&
      baselinePeriod?.end_date
    ) {
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
    const data = { ...dataForCalculateBaseline };
    dispatch(submitBaselineDt(data))
      .then((res) => {
        const updatedBaselineData = {
          status: "CALCULATED",
          data: {
            ...data,
            ...res,
            ...sufficiencyCheckData,
          },
        };
        const baseline_id = getIdByMeterType(meterType);
        if (baseline_id) {
          dispatch(updateBaselineInDb(baseline_id, updatedBaselineData)).then(
            (res) => {
              openBaselineSuccessModal();
              dispatch(fetchBaselineDetailsFromDb(id));
            }
          );
        }
        setActivateCalculateBaseline(true);
      })
      .catch((err) => {});
  };

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
              <Grid container display={"grid"} gap={"2rem"}>
                <Grid item>
                  <Typography variant="h6" sx={headingStyleInAccordion}>
                    Baseline period
                  </Typography>
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
                <Grid item sx={{ overflowX: "scroll" }}>
                  <Typography variant="h6" sx={headingStyleInAccordion}>
                    Sufficiency verification
                  </Typography>
                  <Grid item>
                    <MiniTable
                      columns={userColumn}
                      data={
                        checkSufficiencyAfter && sufficiencyCheckDataLocally
                          ? [sufficiencyCheckDataLocally]
                          : [sufficiencyCheckData]
                      }
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
                              // checked={values.independent_variables.includes(
                              //   variableItem?.id
                              // )}
                              checked={+values?.independent_variables?.includes(
                                +variableItem?.id
                              )}
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
        <Button
          variant="contained"
          color="neutral"
          onClick={onCalculateBaselineButtonClick}
          disabled={activateCalculateBaseline}
        >
          Calculate baseline
        </Button>
      </Grid>
    </Grid>
  );
};

export default ModelConstructorForm;
