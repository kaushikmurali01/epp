import React, { useState, useEffect, useRef, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import { Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { MiniTable } from "components/MiniTable";
import { useSelector } from "react-redux";
import { parseUTCDateToLocalDateTime } from "utils/dateFormat/ConvertIntoDateMonth";
import { isEqual, parseISO } from "date-fns";

const SelectBox = ({ name, options, value, onChange }) => (
  <Select
    sx={{
      "& .MuiSelect-select": {
        color: "#242424",
      },
      maxWidth: "167px",
    }}
    value={value}
    onChange={(e) => onChange(name, e.target.value)}
    fullWidth
    size="small"
  >
    {options?.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </Select>
);

const SavingsReportForm = ({
  meterType,
  p4PStartEndDates,
  initialData,
  submitTrigger,
  refreshTrigger,
  performanceP4PCalcTab,
  onDateValidation,
  p4pIncentiveStatus,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [statuses, setStatuses] = useState({});
  const formikRef = useRef();
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  }, [submitTrigger]);

  useEffect(() => {
    console.log("refresh button triggered");
  }, [refreshTrigger]);

  useEffect(() => {
    // Check if selectedEndDate is equal to p4PStartEndDates.endDate
    if (selectedEndDate && p4PStartEndDates?.endDate) {
      let endDate = parseISO(p4PStartEndDates.endDate);
      console.log(endDate);

      const isDateValid = isEqual(
        parseISO(selectedEndDate.toISOString().split("T")[0]),
        parseISO(endDate.toISOString().split("T")[0])
      );
      onDateValidation(isDateValid);
      console.log(isDateValid);
    } else {
      onDateValidation(false);
    }
  }, [selectedEndDate, p4PStartEndDates?.endDate, onDateValidation]);

  const standardOptions = ["Estimated", "Submitted", "Verified"];
  const paymentStatusOptions = [
    "Application/P4P under review",
    "Application/P4P approved, invoice required",
    "Invoice submitted",
    "Payment issued",
  ];

  const handleChange = (name, value) => {
    // setFormData((prev) => ({ ...prev, [name]: value }));
    setStatuses((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSavingsReport = useCallback(() => {
    const report = {
      data: Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = { value, status: statuses[key] || "Estimated" };
        return acc;
      }, {}),
      performance_type: performanceP4PCalcTab,
      meter_type: meterType,
      facility_id: facility_id,
    };
    console.log(report);
  }, [formData, statuses, performanceP4PCalcTab, meterType, facility_id]);

  const getFields = () => {
    if (meterType === 1) {
      // Electricity
      return [
        {
          name: "adjusted_baseline_energy_consumption",
          label: "Adjusted baseline electricity consumption (kWh)",
        },
        {
          name: "reporting_period_energy_consumption",
          label: "Reporting period electricity consumption (kWh)",
        },
        {
          name: "non_routine_adjustment",
          label: "Non-routine adjustment (kWh)",
        },
        {
          name: "total_energy_savings",
          label: "Total electricity savings (kWh)",
        },
        {
          name: "off_peak_energy_savings",
          label: "Off-peak electricity savings (kWh)",
        },
        {
          name: "on_peak_energy_savings",
          label: "On-peak electricity savings (kWh)",
        },
        {
          name: "off_peak_energy_savings_incentive",
          label: "Off-peak electricity savings incentive ($)",
        },
        {
          name: "on_peak_energy_savings_incentive",
          label: "On-peak electricity savings incentive ($)",
        },
        { name: "performance_incentive", label: "Performance incentive ($)" },
        { name: "peak_demand_savings", label: "Peak demand savings (kW)" },
        {
          name: "energy_savings_percentage",
          label: "Electricity savings as percentage",
        },
      ];
    } else {
      // Natural gas or water
      return [
        {
          name: "adjusted_baseline_energy_consumption",
          label: "Adjusted baseline consumption",
        },
        {
          name: "reporting_period_energy_consumption",
          label: "Reporting period consumption",
        },
        { name: "non_routine_adjustment", label: "Non-routine adjustment" },
        { name: "total_energy_savings", label: "Total savings" },
        { name: "energy_savings_percentage", label: "Savings as percentage" },
      ];
    }
  };

  const fields = getFields();

  const data = [
    {
      metric: "Pay-for-performance period",
      value: `From ${parseUTCDateToLocalDateTime(
        p4PStartEndDates?.startDate
      )}, to`,
      unit: (
        <DatePicker
          sx={{
            "& .MuiInputBase-input": {
              color: "#242424",
            },
          }}
          value={selectedEndDate}
          onChange={(newValue) => setSelectedEndDate(newValue)}
          
          maxDate={parseISO(p4PStartEndDates?.endDate)}
        />
      ),
    },
    ...fields.map((field) => ({
      metric: field.label,
      value: formData[field.name] || "-",
      unit: (
        <SelectBox
          name={field.name}
          options={standardOptions}
          value={statuses[field.name] || "Estimated"}
          onChange={handleChange}
        />
      ),
    })),
    {
      metric: "Performance incentive payment status",
      value: "-",
      unit: (
        <SelectBox
          name="payment_status"
          options={paymentStatusOptions}
          value={statuses.payment_status || ""}
          onChange={handleChange}
        />
      ),
    },
  ];

  const columns = [
    { Header: "", accessor: "metric", cWidth: "40%" },
    { Header: "", accessor: "value", cWidth: "33%" },
    { Header: "", accessor: "unit", cWidth: "27%" },
  ];

  return (
    <Formik
      innerRef={formikRef}
      initialValues={formData}
      onSubmit={handleSaveSavingsReport}
      enableReinitialize
    >
      <Form className="savings-report-table">
        <MiniTable columns={columns} data={data} />
      </Form>
    </Formik>
  );
};

export default SavingsReportForm;
