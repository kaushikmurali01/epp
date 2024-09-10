import {
  Box,
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
import { DatePicker } from "@mui/x-date-pickers";
import { MiniTable } from "components/MiniTable";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { headingStyleInAccordion } from "styles/commonStyles";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { checkBoxButtonStyle } from "./styles";
import { getSummaryDataByMeterType } from ".";
import {
  fetchAdminBaselineDetailsFromDb,
  fetchAdminBaselinePeriod,
  fetchAdminStationsDetails,
} from "../../../../redux/admin/actions/adminBaselineAction";
import { format } from "date-fns";
import InputField from "components/FormBuilder/InputField";
import InputFieldNF from "components/FieldsNotForForms/InputFieldNF";
import DateRangeSlider from "components/DateRangeSlider";

const ModelConstructorView = ({
  openSeeDetails,
  meterType,
  handleSufficiencySettings,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [baselinePeriod, setBaselinePeriod] = useState(null);
  const [baselineStartDate, setBaselineStartDate] = useState("");
  const [baselineEndDate, setBaselineEndDate] = useState("");
  const [disableSeeDetails, setDisableSeeDetails] = useState(false);
  const independentVariables = useSelector(
    (state) => state?.adminBaselineReducer?.independentVariableList
  );
  const baselineListData = useSelector(
    (state) => state?.adminBaselineReducer?.baselineDetailsDb?.data
  );

  const [sufficiencyCheckData, setSufficiencyCheckData] = useState({});
  useEffect(() => {
    dispatch(fetchAdminStationsDetails(id));
  }, [dispatch, id, meterType]);

  const weatherStationsData = useSelector(
    (state) => state?.adminBaselineReducer?.stationDetails
  );

  useEffect(() => {
    dispatch(fetchAdminBaselinePeriod(id, meterType))
      .then((res) => {
        setBaselinePeriod(res);
      })
      .catch((err) => {});
  }, [dispatch, id, meterType]);

  useEffect(() => {
    if (baselineListData) {
      const initialValues = getSummaryDataByMeterType(
        baselineListData,
        meterType
      );
      if (initialValues) {
        setFormData(initialValues?.parameter_data);
        if (initialValues?.parameter_data?.length <= 0) {
          console.log(initialValues.parameter_data);
          setDisableSeeDetails(true);
        } else {
          setDisableSeeDetails(false);
        }
      } else {
        setFormData(null);
      }
      setSufficiencyCheckData({
        daily: { ...initialValues?.parameter_data?.daily },
        hourly: { ...initialValues?.parameter_data?.hourly },
        monthly: { ...initialValues?.parameter_data?.monthly },
      });
      setBaselineStartDate(
        initialValues?.parameter_data?.start_date &&
          format(
            new Date(initialValues?.parameter_data?.start_date),
            "yyyy-MM-dd"
          )
      );
      setBaselineEndDate(
        initialValues?.parameter_data?.end_date &&
          format(
            new Date(initialValues?.parameter_data?.end_date),
            "yyyy-MM-dd"
          )
      );
    }
  }, [id, meterType]);

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
              sufficiencyCheckData,
              baselineStartDate,
              baselineEndDate
            );
          }}
          disabled={disableSeeDetails}
        >
          See details
        </Typography>
      ),
    },
  ];
  return (
    <Grid container>
      <Formik initialValues={formData} enableReinitialize={true}>
        {({ values, setFieldValue, errors }) => {
          return (
            <Form>
              <Grid container display={"grid"} gap={"2rem"}>
                <Grid item>
                  <Typography
                    variant="h6"
                    sx={headingStyleInAccordion}
                    style={{ marginBottom: "90px" }}
                  >
                    Baseline period
                  </Typography>
                  {baselinePeriod?.start_date && baselinePeriod?.end_date && (
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
                      disabled={true}
                    />
                  )}
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
                {values?.weatherStation && (
                  <Grid item>
                    <Grid container mt={4}>
                      <Typography
                        variant="h6"
                        sx={headingStyleInAccordion}
                        mb={"1rem !important"}
                      >
                        Weather Station
                      </Typography>
                    </Grid>

                    <Grid container>
                      {weatherStationsData?.map(
                        (station) =>
                          values?.weatherStation ===
                            (station?.station_id).toString() && (
                            <FormControlLabel
                              key={station?.station_id}
                              value={station?.station_id}
                              control={
                                <Radio
                                  checked={
                                    values?.weatherStation ===
                                    (station?.station_id).toString()
                                  }
                                />
                              }
                              disabled
                              label={
                                <Typography
                                  sx={{
                                    fontSize: "14px!important",
                                    color: "#989898",
                                  }}
                                >
                                  {station?.station_name}
                                </Typography>
                              }
                            />
                          )
                      )}
                    </Grid>
                  </Grid>
                )}
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
                      <FormControlLabel
                        control={
                          <Field
                            name={variableItem?.name}
                            type="checkbox"
                            as={Checkbox}
                            checked={
                              +values?.independent_variables?.includes(
                                +variableItem?.id
                              )
                            }
                            disabled
                          />
                        }
                        sx={{ color: "text.secondary2" }}
                        label={
                          <Typography
                            sx={{
                              fontSize: "14px!important",
                              color: "#989898",
                            }}
                          >
                            {variableItem?.name}
                          </Typography>
                        }
                      />
                    ))}
                  </Box>
                </Grid>
                {values?.dummyVariables && (
                  <Grid item>
                    <Grid container>
                      <Typography
                        variant="h6"
                        sx={headingStyleInAccordion}
                        mb={"1rem !important"}
                      >
                        Select Dummy variable
                      </Typography>
                    </Grid>
                    <Box display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
                      {values?.dummyVariables &&
                        Object.keys(values?.dummyVariables)?.map((dummyVar) => (
                          <FormGroup key={dummyVar}>
                            <FormControlLabel
                              control={
                                <Field
                                  name={`dummyVariables?.${dummyVar}`}
                                  type="checkbox"
                                  as={Checkbox}
                                  checked={values?.dummyVariables?.[dummyVar]}
                                  disabled
                                />
                              }
                              sx={{ color: "text.secondary2" }}
                              label={
                                <Typography
                                  sx={{
                                    fontSize: "14px!important",
                                    color: "#989898",
                                  }}
                                >
                                  {dummyVar}
                                </Typography>
                              }
                            />
                          </FormGroup>
                        ))}
                    </Box>
                  </Grid>
                )}
                <Grid item>
                  <Typography
                    variant="h6"
                    sx={headingStyleInAccordion}
                    mb={"2rem !important"}
                  >
                    Model granularity
                  </Typography>
                  <ToggleButtonGroup
                    value={values?.granularity}
                    exclusive
                    aria-label="text alignment"
                    disabled
                    onChange={(e, value) => {
                      if (value !== null) {
                        setFieldValue("granularity", value);
                      }
                    }}
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

      {formData?.modeling_approach && (
        <Grid item mt={4}>
          <Grid container>
            <Typography
              variant="h6"
              sx={headingStyleInAccordion}
              mb={"1rem !important"}
            >
              Modeling approach
            </Typography>
          </Grid>

          <RadioGroup
            name="modeling_approach"
            value={formData?.modeling_approach}
          >
            <FormControlLabel
              key={formData?.modeling_approach}
              value={formData?.modeling_approach}
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
                      color: "#989898",
                    }}
                  >
                    {formData?.modeling_approach}
                  </Typography>

                  {formData?.modeling_approach !== "CALTRACK Method-TOWT" && (
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
                          value={formData?.model_approach_action}
                          exclusive
                          disabled
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
                          value={formData?.heating_balance_point}
                          isDisabled="true"
                          InputProps={{
                            endAdornment: (
                              <InputFieldNF
                                name="heating_balance_unit"
                                value={formData?.heating_balance_unit}
                                isDisabled="true"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    fieldset: {
                                      border: "none",
                                    },
                                  },
                                }}
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
                          value={formData?.cooling_balance_point}
                          isDisabled="true"
                          InputProps={{
                            endAdornment: (
                              <InputFieldNF
                                name="cooling_balance_unit"
                                value={formData?.cooling_balance_unit}
                                isDisabled="true"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    fieldset: {
                                      border: "none",
                                    },
                                  },
                                }}
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
          </RadioGroup>
        </Grid>
      )}
    </Grid>
  );
};

export default ModelConstructorView;
