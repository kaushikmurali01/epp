import React, { useState, useEffect, useRef, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import { Select, MenuItem, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { MiniTable } from "components/MiniTable";
import { useDispatch, useSelector } from "react-redux";
import { parseUTCDateToLocalDateTime } from "utils/dateFormat/ConvertIntoDateMonth";
import { isEqual, parseISO } from "date-fns";
import { calculateAdminPerformanceReport, updateAdminPerformanceReportInDB } from "../../../../redux/admin/actions/adminPerformanceActions";
import EvModal from "utils/modal/EvModal";

const standardOptions = ["Estimated", "Submitted", "Verified"];
const paymentStatusOptions = [
  {
    value: "Under-review",
    name: "Application/P4P under review",
  },
  {
    value: "Approved-invoice-required",
    name: "Application/P4P approved, invoice required",
  },
  { value: "Submitted", name: "Invoice submitted" },
  { value: "Paid", name: "Payment issued" },
];

const SelectBox = ({ name, options, value, onChange, disabled = false }) => (
  <Select
    sx={{
      "& .MuiSelect-select": {
        color: "#242424",
        fontSize: "1rem !important",
      },
      maxWidth: "167px",
    }}
    value={value}
    onChange={(e) => onChange(name, e.target.value)}
    fullWidth
    size="small"
    disabled={disabled}
  >
    {options?.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.name}
      </MenuItem>
    ))}
  </Select>
);

const SavingsReportForm = ({
  meterType,
  // p4PStartEndDates,
  initialData,
  submitTrigger,
  setSubmitTrigger,
  performanceP4PCalcTab,
  onDateValidation,
  // p4pIncentiveStatus,
  performanceTypeStatus,
  updatePerformanceTypeStatus,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [statuses, setStatuses] = useState({});
  const formikRef = useRef();
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

  const { incentiveSettings } = useSelector(
    (state) => state?.adminPerformanceReducer
  );

  const [p4PStartEndDates, setP4PStartEndDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [p4pIncentiveStatus, setP4pIncentiveStatus] = useState();

   const [submitReportModalConfig, setSubmitReportModalConfig] = useState({
     modalVisible: false,
     modalUI: {
       showHeader: true,
       crossIcon: false,
       modalClass: "",
       headerTextStyle: { color: "rgba(84, 88, 90, 1)" },
       headerSubTextStyle: {
         marginTop: "1rem",
         fontSize: { xs: "14px", md: "18px" },
         fontWeight: 600,
         color: "rgba(36, 36, 36, 1)",
       },
       fotterActionStyle: "",
       modalBodyContentStyle: {
         padding: "0 24px 20px 18px !important",
         fontWeight: 400,
         fontSize: { xs: "12px", md: "14px" },
         lineHeight: "18px",
         color: "#242424",
       },
     },
     buttonsUI: {
       saveButton: false,
       cancelButton: false,
       saveButtonName: "Sent Request",
       cancelButtonName: "Cancel",
       saveButtonClass: "",
       cancelButtonClass: "",
     },
     modalBodyContent: "",
   });

   const openSubmitReportModal = () => {
     setSubmitReportModalConfig((prevState) => ({
       ...prevState,
       modalVisible: true,
       headerText: <Grid container sx={{ justifyContent: "center" }}>
        <figure>
          <img src="/images/new_user_popup_icon.svg" alt="" />
        </figure>
       </Grid>,
       headerSubText: "Thank you for submitting Savings Report!",
       modalBodyContent: "We have received your 1st Pay-for-Performance Period Savings Report and will review it shortly. Please note that this process may take some time. We appreciate your patience and understanding.  Once reviewed, you will receive an email.",
     }));
   };

  useEffect(() => {
    if (initialData) {
      const newFormData = {};
      const newStatuses = {};
      Object.entries(initialData).forEach(([key, { value, status }]) => {
        newFormData[key] = value;
        newStatuses[key] = status;
      });
      setFormData(newFormData);
      setStatuses(newStatuses);
    }
  }, [initialData]);

  useEffect(() => {
    let startDate = "";
    let endDate = "";
    let p4pIncentiveStatus = "";

    if (incentiveSettings) {
      switch (performanceP4PCalcTab) {
        case 1:
          startDate = incentiveSettings.p4pStartDate1;
          endDate = incentiveSettings.p4pEndDate1;
          p4pIncentiveStatus = incentiveSettings.p4pIncentiveStatus1;
          break;
        case 2:
          startDate = incentiveSettings.p4pStartDate2;
          endDate = incentiveSettings.p4pEndDate2;
          p4pIncentiveStatus = incentiveSettings.p4pIncentiveStatus2;
          break;
        case 3:
          startDate = incentiveSettings.p4pStartDate3;
          endDate = incentiveSettings.p4pEndDate3;
          p4pIncentiveStatus = incentiveSettings.p4pIncentiveStatus3;
          break;
        default:
          break;
      }
    }

    setP4PStartEndDates({ startDate, endDate });
    setP4pIncentiveStatus(p4pIncentiveStatus);
  }, [performanceP4PCalcTab, incentiveSettings]);

  useEffect(() => {
    if (submitTrigger && formikRef.current) {
      formikRef.current.handleSubmit();
      setSelectedEndDate(null);
      setSubmitTrigger(false);
    }
  }, [submitTrigger]);

  useEffect(() => {
    // Check if selectedEndDate is equal to setting's EndDate
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

  const handleDateChange = (newValue) => {
    setSelectedEndDate(newValue);
    if (newValue && p4PStartEndDates.startDate) {
      const payload = {
        start_date: p4PStartEndDates.startDate,
        end_date: newValue.toISOString().split("T")[0],
        facility_id: facility_id,
        meter_type: meterType,
      };

      try {
        const result = dispatch(calculateAdminPerformanceReport(payload));
        // setFormData(result.data);
        console.log(payload, result, "refresh payload - result");
      } catch (error) {
        console.error("Error calculating performance report:", error);
      }
    }
  };


  const handleSaveSavingsReport = useCallback(() => {
    let newPerformanceTypeStatus = { ...performanceTypeStatus };

    if (performanceP4PCalcTab === 1) {
      newPerformanceTypeStatus = {
        1: "in-active",
        2: "active",
        3: "in-active",
      };
    } else if (performanceP4PCalcTab === 2) {
      newPerformanceTypeStatus = {
        1: "in-active",
        2: "in-active",
        3: "active",
      };
    }

    updatePerformanceTypeStatus(newPerformanceTypeStatus);

    // Set all statuses to "Submitted"
    // const newStatuses = Object.keys(formData).reduce((acc, key) => {
    //   acc[key] = "Submitted";
    //   return acc;
    // }, {});
    // setStatuses(newStatuses);

    const report = {
      data: Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = { value, status: "Submitted" };
        return acc;
      }, {}),
      performance_type: performanceP4PCalcTab,
      performance_type_status: newPerformanceTypeStatus,
      meter_type: meterType,
    };
    console.log(report);
    dispatch(updateAdminPerformanceReportInDB(facility_id, report))
      .then(() => {
        openSubmitReportModal();
      })
      .catch((error) => {
        console.error(error);
    })
  }, [
    formData,
    performanceP4PCalcTab,
    meterType,
    performanceTypeStatus,
    updatePerformanceTypeStatus,
  ]);


  const handleChange = (name, value) => {
    setStatuses((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSaveSavingsReport = useCallback(() => {
  //   let newPerformanceTypeStatus = { ...performanceTypeStatus };

  //   if (performanceP4PCalcTab === 1) {
  //     newPerformanceTypeStatus = {
  //       1: "in-active",
  //       2: "active",
  //       3: "in-active",
  //     };
  //   } else if (performanceP4PCalcTab === 2) {
  //     newPerformanceTypeStatus = {
  //       1: "in-active",
  //       2: "in-active",
  //       3: "active",
  //     };
  //   }

  //   updatePerformanceTypeStatus(newPerformanceTypeStatus);

  //   // Set all statuses to "Submitted"
  //   // const newStatuses = Object.keys(formData).reduce((acc, key) => {
  //   //   acc[key] = "Submitted";
  //   //   return acc;
  //   // }, {});
  //   // setStatuses(newStatuses);

  //   const report = {
  //     data: Object.entries(formData).reduce((acc, [key, value]) => {
  //       acc[key] = { value, status: "Submitted" };
  //       return acc;
  //     }, {}),
  //     performance_type: performanceP4PCalcTab,
  //     performance_type_status: newPerformanceTypeStatus,
  //     meter_type: meterType,
  //     facility_id: facility_id,
  //   };
  //   console.log(report);
  // }, [formData, statuses, performanceP4PCalcTab, meterType, facility_id]);

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
          name: "on_peak_energy_savings",
          label: "On-peak electricity savings (kWh)",
        },
        {
          name: "off_peak_energy_savings",
          label: "Off-peak electricity savings (kWh)",
        },
        {
          name: "total_energy_savings",
          label: "Total electricity savings (kWh)",
        },
        { name: "peak_demand_savings", label: "Peak demand savings (kW)" },
        {
          name: "energy_savings_percentage",
          label:
            "Electricity savings as percentage of adjusted baseline electricity consumption and non-routine adjustment ",
        },
        {
          name: "incremental_yoy_savings ",
          label: "Incremental year-over-year electricity savings (kWh) ",
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
      ];
    } else {
      // Natural gas or water
      return [
        {
          name: "adjusted_baseline_energy_consumption",
          label: "Adjusted baseline NG consumption",
        },
        {
          name: "reporting_period_energy_consumption",
          label: "Reporting period NG consumption",
        },
        { name: "non_routine_adjustment", label: "Non-routine adjustment" },
        { name: "total_energy_savings", label: "NG savings" },
        {
          name: "energy_savings_percentage",
          label:
            "NG savings as percentage of adjusted baseline NG consumption and non-routine adjustment ",
        },
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
              fontSize: "1rem",
            },
          }}
          value={selectedEndDate}
          onChange={handleDateChange}
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
          options={standardOptions.map((option) => ({
            value: option,
            name: option,
          }))}
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
          value={p4pIncentiveStatus || "Under-review"}
          onChange={() => {}}
          disabled={true}
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
    <>
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
      <EvModal
        modalConfig={submitReportModalConfig}
        setModalConfig={setSubmitReportModalConfig}
      />
    </>
  );
};

export default SavingsReportForm;
