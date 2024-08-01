import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, useFormikContext } from "formik";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField, Select, MenuItem, styled, InputAdornment, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MiniTable } from "components/MiniTable";
import {
  getIncentiveSettings,
  updateIncentiveSettings,
} from "../../../../redux/admin/actions/adminPerformanceActions";
import debounce from "lodash.debounce";
import Loader from "pages/Loader";

const StyledHelperText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(-1.5),
  textAlign: "left",
  fontSize: "0.75rem",
}));


const DatePickerField = ({ field, form: { values, setFieldValue } }) => {
  const { submitForm } = useFormikContext();

  const getMinMaxDates = () => {
    const fieldNumber = parseInt(field.name.slice(-1));
    const startFieldName = `p4pStartDate${fieldNumber}`;
    const endFieldName = `p4pEndDate${fieldNumber}`;
    const prevEndFieldName =
      fieldNumber > 1 ? `p4pEndDate${fieldNumber - 1}` : null;

    if (field.name.includes("StartDate")) {
      return {
        minDate:
          prevEndFieldName && values[prevEndFieldName]
            ? new Date(values[prevEndFieldName])
            : null,
        maxDate: values[endFieldName] ? new Date(values[endFieldName]) : null,
      };
    } else if (field.name.includes("EndDate")) {
      return {
        minDate: values[startFieldName]
          ? new Date(values[startFieldName])
          : null,
        maxDate: null,
      };
    }
    return { minDate: null, maxDate: null };
  };

  const { minDate, maxDate } = getMinMaxDates();

  const handleDateChange = (date) => {
    const fieldNumber = parseInt(field.name.slice(-1));
    const startFieldName = `p4pStartDate${fieldNumber}`;
    const endFieldName = `p4pEndDate${fieldNumber}`;

    if (date) {
      setFieldValue(field.name, date.toISOString().split("T")[0]);

      // If it's a start date, automatically set the end date to one year later
      if (field.name.includes("StartDate")) {
        const endDate = new Date(date);
        endDate.setFullYear(endDate.getFullYear() + 1);
        setFieldValue(endFieldName, endDate.toISOString().split("T")[0]);
      }
    } else {
      setFieldValue(field.name, "");
      if (field.name.includes("StartDate")) {
        setFieldValue(endFieldName, "");
      }
    }
    submitForm();
  };

  return (
    <div>
      <StyledHelperText>*</StyledHelperText>
      <DatePicker
        value={field.value ? new Date(field.value) : null}
        onChange={handleDateChange}
        slots={{ openPickerIcon: ExpandMoreIcon }}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
};



// const DatePickerField = ({ field, form: { values, setFieldValue } }) => {
//   const { submitForm } = useFormikContext();

//   const getMinMaxDates = () => {
//     const fieldNumber = field.name.slice(-1);
//     const startFieldName = `p4pStartDate${fieldNumber}`;
//     const endFieldName = `p4pEndDate${fieldNumber}`;

//     if (field.name.includes("StartDate")) {
//       return {
//         minDate: null,
//         maxDate: values[endFieldName] ? new Date(values[endFieldName]) : null,
//       };
//     } else if (field.name.includes("EndDate")) {
//       return {
//         minDate: values[startFieldName]
//           ? new Date(values[startFieldName])
//           : null,
//         maxDate: null,
//       };
//     }
//     return { minDate: null, maxDate: null };
//   };

//   const { minDate, maxDate } = getMinMaxDates();

//   return (
//     <div>
//       <StyledHelperText>*</StyledHelperText>
//       <DatePicker
//         value={field.value ? new Date(field.value) : null}
//         onChange={(date) => {
//           setFieldValue(
//             field.name,
//             date ? date.toISOString().split("T")[0] : ""
//           );
//           submitForm();
//         }}
//         slots={{ openPickerIcon: ExpandMoreIcon }}
//         minDate={minDate}
//         maxDate={maxDate}
//       />
//     </div>
//   );
// };



// const DatePickerField = ({ field, form: { setFieldValue } }) => {
//   const { submitForm } = useFormikContext();

//   return (
//     <div>
//       <StyledHelperText>*</StyledHelperText>
//       <DatePicker
//         value={field.value ? new Date(field.value) : null}
//         onChange={(date) => {
//           setFieldValue(
//             field.name,
//             date ? date.toISOString().split("T")[0] : ""
//           );
//           submitForm();
//         }}
//         slots={{ openPickerIcon: ExpandMoreIcon }}
//       />
//     </div>
//   );
// };

const InputField = ({ field, form: { setFieldValue } }) => {
  const { submitForm } = useFormikContext();

  const handleChange = (event) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9.]/g, "");
    setFieldValue(field.name, numericValue ? Number(numericValue) : "");
    submitForm();
  };

  return (
    <TextField
      {...field}
      type="text"
      value={field.value || ""}
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
      }}
      onKeyDown={(evt) =>
        ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
      }
      onBlur={handleChange}
    />
  );
};

const SelectField = ({ field }) => {
  const { setFieldValue, submitForm } = useFormikContext();

  useEffect(() => {
    if (!field.value) {
      setFieldValue(field.name, "Under-review");
    }
  }, [field.name, field.value, setFieldValue]);

  return (
    <Select
      {...field}
      onChange={(e) => {
        const value = e.target.value;
        setFieldValue(field.name, value);
        submitForm();
      }}
      displayEmpty={true}
      sx={{
        maxWidth: "164px",
        fontSize: "1rem",
        "& .MuiSelect-select": {
          fontSize: "1rem",
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
  const { incentiveSettings, loading, error } = useSelector(
    (state) => state.adminPerformanceReducer
  );

  useEffect(() => {
    if (facility_id) {
      dispatch(getIncentiveSettings(facility_id));
    } else {
      console.error("Facility ID is not available");
    }
  }, [dispatch, facility_id]);

  const requiredFields = [
    "p4pStartDate1",
    "p4pEndDate1",
    "p4pStartDate2",
    "p4pEndDate2",
    "p4pStartDate3",
    "p4pEndDate3",
  ];

  const validateForm = (values) => {
    return requiredFields.every(
      (field) => values[field] && values[field].trim() !== ""
    );
  };

  const debouncedUpdateSettings = useCallback(
    debounce((values) => {
      if (!validateForm(values)) {
        console.log("Not all required fields are filled");
        return; // Don't proceed with API call if validation fails
      }

      const updatedValues = Object.entries(values).reduce(
        (acc, [key, value]) => {
          if (typeof value === "string" && value.trim() === "") {
            delete acc[key];
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const updatedSettingsPayload = {
        ...updatedValues,
        preProjectIncentive: Number(values.preProjectIncentive),
        onPeakIncentiveRate: Number(values.onPeakIncentiveRate),
        offPeakIncentiveRate: Number(values.offPeakIncentiveRate),
        minimumSavings: Number(values.minimumSavings),
        preProjectIncentiveStatus: values.preProjectIncentiveStatus,
        p4pIncentiveStatus1: values.p4pIncentiveStatus1,
        p4pIncentiveStatus2: values.p4pIncentiveStatus2,
        p4pIncentiveStatus3: values.p4pIncentiveStatus3,
      };

      dispatch(updateIncentiveSettings(updatedSettingsPayload, facility_id))
        .then(() => {
          dispatch(getIncentiveSettings(facility_id));
        })
        .catch((error) => {
          console.error("Error updating settings:", error);
        });
    }, 1500),
    [dispatch]
  );

  const userColumn = [
    { Header: "", accessor: "id" },
    { Header: "", accessor: "first_column" },
    { Header: "1st P4P", accessor: "first_p4p" },
    { Header: "2nd P4P", accessor: "second_p4p" },
    { Header: "3rd P4P", accessor: "third_p4p" },
  ];

  const initialValues = {
    p4pStartDate1: incentiveSettings?.p4pStartDate1 || "",
    p4pEndDate1: incentiveSettings?.p4pEndDate1 || "",
    p4pStartDate2: incentiveSettings?.p4pStartDate2 || "",
    p4pEndDate2: incentiveSettings?.p4pEndDate2 || "",
    p4pStartDate3: incentiveSettings?.p4pStartDate3 || "",
    p4pEndDate3: incentiveSettings?.p4pEndDate3 || "",
    preProjectIncentive: incentiveSettings?.preProjectIncentive || "",
    preProjectIncentiveStatus:
      incentiveSettings?.preProjectIncentiveStatus || "Under-review",
    p4pIncentiveStatus1:
      incentiveSettings?.p4pIncentiveStatus1 || "Under-review",
    p4pIncentiveStatus2:
      incentiveSettings?.p4pIncentiveStatus2 || "Under-review",
    p4pIncentiveStatus3:
      incentiveSettings?.p4pIncentiveStatus3 || "Under-review",
    onPeakIncentiveRate: incentiveSettings?.onPeakIncentiveRate || "",
    offPeakIncentiveRate: incentiveSettings?.offPeakIncentiveRate || "",
    minimumSavings: incentiveSettings?.minimumSavings || "",
  };

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

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={debouncedUpdateSettings}
        enableReinitialize
      >
        {({ values }) => (
          <Form className="incentive-settings-table">
            <MiniTable
              columns={userColumn}
              data={[
                {
                  id: "Pay-for-performance start",
                  first_column: null,
                  first_p4p: renderField("p4pStartDate1", "date"),
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
              ]}
            />
          </Form>
        )}
      </Formik>
      <Loader
        sectionLoader
        minHeight="100vh"
        loadingState={loading}
        loaderPosition="fixed"
      />
    </>
  );
};

export default IncentiveSettingsMicroComponent;
