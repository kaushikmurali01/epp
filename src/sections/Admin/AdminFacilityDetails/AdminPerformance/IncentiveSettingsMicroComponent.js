import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form } from "formik";
import { DatePicker } from "@mui/x-date-pickers";
import {
  TextField,
  Select,
  MenuItem,
  styled,
  Button,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MiniTable } from "components/MiniTable";
import {
  getIncentiveSettings,
  updateIncentiveSettings,
} from "../../../../redux/admin/actions/adminPerformanceActions";
import Loader from "pages/Loader";
import { incentiveSettingValidationSchema } from "utils/validations/formValidation";
import { fetchAdminFacilityStatus } from "../../../../redux/admin/actions/adminFacilityActions";

import { parseISO, format, parse, addDays } from "date-fns";

const StyledHelperText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(-1.5),
  textAlign: "left",
  fontSize: "0.75rem",
}));

const DatePickerField = ({
  field,
  form: { setFieldValue, values },
  minDate: propMinDate,
}) => {
  const handleDateChange = (date) => {
    if (date) {
      // Convert the selected date to UTC and format it as YYYY-MM-DD
      const formattedDate = format(date, "yyyy-MM-dd");
      setFieldValue(field.name, formattedDate);

      const fieldNumber = parseInt(field.name.slice(-1));
      const isStartDate = field.name.includes("StartDate");

      if (isStartDate) {
        // Set end date to one year later (minus one day) for the current period
        const endDate = new Date(date);
        endDate.setUTCFullYear(endDate.getUTCFullYear() + 1);
        endDate.setUTCDate(endDate.getUTCDate() - 1);
        setFieldValue(
          `p4pEndDate${fieldNumber}`,
          format(endDate, "yyyy-MM-dd")
        );

        // Set start and end dates for subsequent periods
        for (let i = fieldNumber + 1; i <= 3; i++) {
          const nextStartDate = new Date(endDate);
          nextStartDate.setUTCDate(nextStartDate.getUTCDate() + 1);
          setFieldValue(
            `p4pStartDate${i}`,
            format(nextStartDate, "yyyy-MM-dd")
          );

          const nextEndDate = new Date(nextStartDate);
          nextEndDate.setUTCFullYear(nextEndDate.getUTCFullYear() + 1);
          nextEndDate.setUTCDate(nextEndDate.getUTCDate() - 1);
          setFieldValue(`p4pEndDate${i}`, format(nextEndDate, "yyyy-MM-dd"));

          endDate.setTime(nextEndDate.getTime());
        }
      } else {
        // If it's an end date, update subsequent periods
        for (let i = fieldNumber + 1; i <= 3; i++) {
          const nextStartDate = new Date(date);
          nextStartDate.setUTCDate(nextStartDate.getUTCDate() + 1);
          setFieldValue(
            `p4pStartDate${i}`,
            format(nextStartDate, "yyyy-MM-dd")
          );

          const nextEndDate = new Date(nextStartDate);
          nextEndDate.setUTCFullYear(nextEndDate.getUTCFullYear() + 1);
          nextEndDate.setUTCDate(nextEndDate.getUTCDate() - 1);
          setFieldValue(`p4pEndDate${i}`, format(nextEndDate, "yyyy-MM-dd"));

          date.setTime(nextEndDate.getTime());
        }
      }
    } else {
      setFieldValue(field.name, null);
    }
  };

  const getMinMaxDates = () => {
    const fieldNumber = parseInt(field.name.slice(-1));
    const isStartDate = field.name.includes("StartDate");

    const parseDateString = (dateString) => {
      if (!dateString) return null;
      // Check if the dateString includes time
      if (dateString.includes(" ")) {
        // Parse the full datetime string
        return parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date());
      } else {
        // Parse just the date string
        return parseISO(dateString);
      }
    };

    if (isStartDate && fieldNumber === 1) {
      return {
        minDate: propMinDate ? parseDateString(propMinDate) : null,
        maxDate: values[`p4pEndDate${fieldNumber}`]
          ? parseDateString(values[`p4pEndDate${fieldNumber}`])
          : null,
      };
    }

    if (isStartDate) {
      const prevEndDate =
        fieldNumber > 1 ? values[`p4pEndDate${fieldNumber - 1}`] : null;
      const currentEndDate = values[`p4pEndDate${fieldNumber}`];
      return {
        minDate: prevEndDate ? addDays(parseDateString(prevEndDate), 1) : null,
        maxDate: currentEndDate ? parseDateString(currentEndDate) : null,
      };
    } else {
      const currentStartDate = values[`p4pStartDate${fieldNumber}`];
      return {
        minDate: currentStartDate ? parseDateString(currentStartDate) : null,
        maxDate: null,
      };
    }
  };

  const { minDate, maxDate } = getMinMaxDates();

  return (
    <div>
      <StyledHelperText>*</StyledHelperText>
      <DatePicker
        value={field.value ? parseISO(field.value) : null}
        onChange={handleDateChange}
        slots={{ openPickerIcon: ExpandMoreIcon }}
        minDate={minDate}
        maxDate={maxDate}
        format="MM/dd/yyyy"
        sx={{
          "& .MuiInputBase-input": {
            color: "#242424",
          },
        }}
        slotProps={{
          textField: {
            readOnly: true,
          },
        }}
      />
    </div>
  );
};

const InputField = ({ field }) => {
  const handleKeyDown = (evt) => {
    // Allow only numbers, decimal point, backspace, delete, arrow keys
    if (
      !/[\d.]/.test(evt.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(evt.key)
    ) {
      evt.preventDefault();
    }

    // Prevent multiple decimal points
    if (evt.key === "." && field.value.toString().includes(".")) {
      evt.preventDefault();
    }
  };

  const handleChange = (evt) => {
    const value = evt.target.value;
    // Allow empty string or valid number with optional decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      field.onChange(evt);
    }
  };

  return (
    <TextField
      {...field}
      type="text"
      value={field.value || ""}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      sx={{
        "& .MuiInputBase-input": {
          color: "#242424",
        },
      }}
    />
  );
};

const SelectField = ({ field, form: { setFieldValue } }) => {
  return (
    <Select
      {...field}
      onChange={(e) => setFieldValue(field.name, e.target.value)}
      // displayEmpty={true}
      sx={{
        maxWidth: "164px",
        minWidth: "156px",
        fontSize: "1rem",
        "& .MuiSelect-select": {
          fontSize: "1rem",
          color: "#242424",
        },
      }}
    >
      <MenuItem value="Under-review">Application/P4P under review</MenuItem>
      <MenuItem value="Approved-invoice-required">
        Application/P4P approved, invoice required
      </MenuItem>
      <MenuItem value="Submitted">Invoice submitted</MenuItem>
      <MenuItem value="Paid">Payment issued</MenuItem>
    </Select>
  );
};

const IncentiveSettingsMicroComponent = () => {
  const dispatch = useDispatch();
  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );
  const {
    incentiveSettings,
    loading,
    adminPerformanceDataMinMaxDate,
    adminBaselineSummaryData,
  } = useSelector((state) => state.adminPerformanceReducer);

  const [formValues, setFormValues] = useState(null);

  useEffect(() => {
    if (facility_id) {
      dispatch(getIncentiveSettings(facility_id));
    } else {
      console.error("Facility ID is not available");
    }
  }, [dispatch, facility_id]);

  const baselineSummary =
    adminBaselineSummaryData?.baseline_summary_performance_page || {};

  useEffect(() => {
    if (incentiveSettings && baselineSummary) {
      setFormValues({
        p4pStartDate1: incentiveSettings.p4pStartDate1 || "",
        p4pEndDate1: incentiveSettings.p4pEndDate1 || "",
        p4pStartDate2: incentiveSettings.p4pStartDate2 || "",
        p4pEndDate2: incentiveSettings.p4pEndDate2 || "",
        p4pStartDate3: incentiveSettings.p4pStartDate3 || "",
        p4pEndDate3: incentiveSettings.p4pEndDate3 || "",
        preProjectIncentive: incentiveSettings.preProjectIncentive || "",
        preProjectIncentiveStatus:
          incentiveSettings.preProjectIncentiveStatus || "",
        p4pIncentiveStatus1: incentiveSettings.p4pIncentiveStatus1 || "",
        p4pIncentiveStatus2: incentiveSettings.p4pIncentiveStatus2 || "",
        p4pIncentiveStatus3: incentiveSettings.p4pIncentiveStatus3 || "",
        onPeakIncentiveRate: incentiveSettings.onPeakIncentiveRate || "",
        offPeakIncentiveRate: incentiveSettings.offPeakIncentiveRate || "",
        minimumSavings: incentiveSettings.minimumSavings || "",
        incentive_cap:
          incentiveSettings.incentive_cap ||
          baselineSummary["Incentive Cap"] ||
          "",
      });
    }
  }, [incentiveSettings, adminBaselineSummaryData]);

  const handleSubmit = (values) => {
    const numericFields = [
      "preProjectIncentive",
      "onPeakIncentiveRate",
      "offPeakIncentiveRate",
      "minimumSavings",
      "incentive_cap",
    ];

    const updatedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (numericFields.includes(key)) {
        // acc[key] = value.trim() !== "" ? Number(value) : null;
        const stringValue = String(value);
        acc[key] = stringValue.trim() !== "" ? Number(stringValue) : null;
      } else if (typeof value === "string" && value.trim() === "") {
        delete acc[key];
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    const payload = {
      ...updatedValues,
    };

    dispatch(updateIncentiveSettings(payload, facility_id))
      .then(() => {
        dispatch(getIncentiveSettings(facility_id));
        dispatch(fetchAdminFacilityStatus(facility_id));
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
      });
  };

  const userColumn = [
    { Header: "", accessor: "id" },
    { Header: "", accessor: "first_column" },
    { Header: "1st P4P", accessor: "first_p4p" },
    { Header: "2nd P4P", accessor: "second_p4p" },
    { Header: "3rd P4P", accessor: "third_p4p" },
  ];

  const renderField = (fieldName, type) => {
    switch (type) {
      case "date":
        return <Field name={fieldName} component={DatePickerField} />;
      case "select":
        return <Field name={fieldName} component={SelectField} />;
      case "number":
        return <Field name={fieldName} component={InputField} />;
      default:
        return null;
    }
  };

  if (!formValues) {
    return (
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    );
  }

  return (
    <Formik
      initialValues={formValues}
      validationSchema={incentiveSettingValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, isValid, dirty }) => (
        <Form className="incentive-settings-table" style={{ width: "100%" }}>
          <MiniTable
            firstChildColored
            columns={userColumn}
            data={[
              {
                id: "Pay-for-performance start",
                first_column: null,
                first_p4p: (
                  <Field
                    name="p4pStartDate1"
                    component={DatePickerField}
                    minDate={adminPerformanceDataMinMaxDate?.min_date}
                  />
                ),
                second_p4p: renderField("p4pStartDate2", "date"),
                third_p4p: renderField("p4pStartDate3", "date"),
              },
              {
                id: "Pay-for-performance end",
                first_column: null,
                first_p4p: renderField("p4pEndDate1", "date"),
                second_p4p: renderField("p4pEndDate2", "date"),
                third_p4p: renderField("p4pEndDate3", "date"),
              },
              {
                id: "Pre-Project incentive ($)",
                first_column: renderField("preProjectIncentive", "number"),
                first_p4p: null,
                second_p4p: null,
                third_p4p: null,
              },
              {
                id: "Pre-Project incentive status",
                first_column: renderField(
                  "preProjectIncentiveStatus",
                  "select"
                ),
                first_p4p: null,
                second_p4p: null,
                third_p4p: null,
              },
              {
                id: "Pay-for-performance incentive status",
                first_column: null,
                first_p4p: renderField("p4pIncentiveStatus1", "select"),
                second_p4p: renderField("p4pIncentiveStatus2", "select"),
                third_p4p: renderField("p4pIncentiveStatus3", "select"),
              },
              {
                id: "On-peak Pay-for-performance incentive rate ($/kWh)",
                first_column: null,
                first_p4p: renderField("onPeakIncentiveRate", "number"),
                second_p4p: null,
                third_p4p: null,
              },
              {
                id: "Off-peak Pay-for-performance incentive rate ($/kWh)",
                first_column: null,
                first_p4p: renderField("offPeakIncentiveRate", "number"),
                second_p4p: null,
                third_p4p: null,
              },
              {
                id: "Minimum savings (%)",
                first_column: renderField("minimumSavings", "number"),
                first_p4p: null,
                second_p4p: null,
                third_p4p: null,
              },
              {
                id: "Incentive cap",
                first_column: renderField("incentive_cap", "number"),
                first_p4p: null,
                second_p4p: null,
                third_p4p: null,
              },
            ]}
          />
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              type="submit"
              disabled={!(isValid && dirty)}
              variant="contained"
              color="primary"
            >
              Save settings
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default IncentiveSettingsMicroComponent;
