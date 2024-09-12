import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { Select, MenuItem, Grid, Box, Tooltip, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { MiniTable } from "components/MiniTable";
import { useDispatch, useSelector } from "react-redux";
import { format, isBefore, isEqual, isValid, parse, parseISO } from "date-fns";
import {
  calculateAdminPerformanceReport,
  getAdminPerformanceReportFromDB,
  updateAdminPerformanceReportInDB,
} from "../../../../redux/admin/actions/adminPerformanceActions";
import EvModal from "utils/modal/EvModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import CommonDataAvailabilityAlert from "components/CommonDataAvailabilityAlert";
import { formatNumber } from "utils/numberFormatter";

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
  meter_type,
  initialData,
  submitTrigger,
  setSubmitTrigger,
  performanceP4PCalcTab,
  onDateValidation,
  isSubmitted,
  onP4PStartDatesLoaded,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [statuses, setStatuses] = useState({});
  const formikRef = useRef();
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const facility_id = useSelector(
    (state) => state?.adminFacilityReducer?.facilityDetails?.data?.id
  );

  const {
    incentiveSettings,
    adminCalculatedPerformanceReport,
    adminPerformanceDataMinMaxDate,
  } = useSelector((state) => state?.adminPerformanceReducer);

  const [p4PStartEndDates, setP4PStartEndDates] = useState({
    startDate: null,
    endDate: null,
  });

  const [p4pIncentiveStatus, setP4pIncentiveStatus] = useState("Under-review");

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

  const openVerifiedReportModal = () => {
    setSubmitReportModalConfig((prevState) => ({
      ...prevState,
      modalVisible: true,
      headerText: (
        <Grid container sx={{ justifyContent: "center" }}>
          <figure>
            <img src="/images/new_user_popup_icon.svg" alt="" />
          </figure>
        </Grid>
      ),
      headerSubText: "Savings report has been verified successfully!",
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
      if (isSubmitted) {
        setSelectedEndDate(
          p4PStartEndDates.endDate ? parseISO(p4PStartEndDates.endDate) : null
        );
      }
    } else {
      setFormData({});
      setStatuses({});
      setSelectedEndDate(null);
    }
  }, [initialData, performanceP4PCalcTab, isSubmitted]);

  const getP4PData = (tab, settings) => {
    const defaultData = {
      startDate: null,
      endDate: null,
      status: "Under-review",
    };

    const p4pDataMap = {
      1: {
        startDate: settings.p4pStartDate1,
        endDate: settings.p4pEndDate1,
        status: settings.p4pIncentiveStatus1,
      },
      2: {
        startDate: settings.p4pStartDate2,
        endDate: settings.p4pEndDate2,
        status: settings.p4pIncentiveStatus2,
      },
      3: {
        startDate: settings.p4pStartDate3,
        endDate: settings.p4pEndDate3,
        status: settings.p4pIncentiveStatus3,
      },
    };

    return {
      startDate: p4pDataMap[tab]?.startDate || defaultData.startDate,
      endDate: p4pDataMap[tab]?.endDate || defaultData.endDate,
      status: p4pDataMap[tab]?.status || defaultData.status,
    };
  };

  useEffect(() => {
    if (!incentiveSettings) return;

    const { startDate, endDate, status } = getP4PData(
      performanceP4PCalcTab,
      incentiveSettings
    );

    setP4PStartEndDates({ startDate, endDate });
    setP4pIncentiveStatus(status);
  }, [performanceP4PCalcTab, incentiveSettings, selectedEndDate]);

  useEffect(() => {
    if (incentiveSettings) {
      const allStartDates = {
        1: incentiveSettings.p4pStartDate1,
        2: incentiveSettings.p4pStartDate2,
        3: incentiveSettings.p4pStartDate3,
      };
      onP4PStartDatesLoaded(allStartDates);
    }
  }, [incentiveSettings]);

  useEffect(() => {
    if (submitTrigger && formikRef.current) {
      formikRef.current.handleSubmit();
      setSelectedEndDate(null);
      setSubmitTrigger(false);
    }
  }, [submitTrigger]);

  useEffect(() => {
    if (selectedEndDate && p4PStartEndDates?.endDate) {
      let endDate = p4PStartEndDates.endDate;
      const isDateValid = endDate
        ? isEqual(
            format(selectedEndDate, "yyyy-MM-dd"),
            format(endDate, "yyyy-MM-dd")
          )
        : false;
      onDateValidation(isDateValid);
    } else {
      onDateValidation(false);
    }
  }, [selectedEndDate, p4PStartEndDates?.endDate, onDateValidation]);

  const handleDateChange = (newValue) => {
    setSelectedEndDate(newValue);
    if (newValue && p4PStartEndDates?.startDate) {
      const payload = {
        start_date: p4PStartEndDates.startDate,
        end_date: format(newValue, "yyyy-MM-dd"),
        facility_id: facility_id,
        meter_type: meter_type,
      };
      try {
        dispatch(calculateAdminPerformanceReport(payload)).then(() => {
          // Reset all statuses to "Submitted" after calculation
          setStatuses((prevStatuses) =>
            Object.keys(prevStatuses).reduce((acc, key) => {
              acc[key] = "Submitted";
              return acc;
            }, {})
          );
        });
      } catch (error) {
        console.error("Error calculating performance report:", error);
      }
    }
  };

  useEffect(() => {
    if (adminCalculatedPerformanceReport) {
      setFormData(adminCalculatedPerformanceReport);
    }
  }, [adminCalculatedPerformanceReport]);

  const handleRefreshCalculation = useCallback(() => {
    if (!selectedEndDate) return;

    if (selectedEndDate && p4PStartEndDates?.startDate) {
      const startDate = parseISO(p4PStartEndDates.startDate);

      if (!isValid(startDate)) {
        console.error("Invalid start date");
        return;
      }

      const payload = {
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(selectedEndDate, "yyyy-MM-dd"),
        facility_id: facility_id,
        meter_type: meter_type,
      };

      try {
        dispatch(calculateAdminPerformanceReport(payload)).then(() => {
          // Reset all statuses to "Submitted" after calculation
          setStatuses((prevStatuses) =>
            Object.keys(prevStatuses).reduce((acc, key) => {
              acc[key] = "Submitted";
              return acc;
            }, {})
          );
        });
      } catch (error) {
        console.error("Error calculating performance report:", error);
      }
    }
  }, [selectedEndDate, p4PStartEndDates, facility_id, meter_type, dispatch]);

  const handleSaveSavingsReport = useCallback(
    (currentStatuses = statuses) => {
      let allCalculationsVerified = Object.values(currentStatuses).every(
        (status) => status === "Verified"
      );
      const report = {
        data: Object.entries(formData).reduce((acc, [key, value]) => {
          acc[key] = { value, status: currentStatuses[key] || "Submitted" };
          return acc;
        }, {}),
        performance_type: performanceP4PCalcTab,
        meter_type: meter_type,
        status: allCalculationsVerified ? "VERIFIED" : "SUBMITTED",
      };
      dispatch(updateAdminPerformanceReportInDB(facility_id, report))
        .then(() => {
          if (allCalculationsVerified) {
            openVerifiedReportModal();
          }
          dispatch(
            getAdminPerformanceReportFromDB(
              facility_id,
              meter_type,
              performanceP4PCalcTab
            )
          );
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [
      formData,
      performanceP4PCalcTab,
      meter_type,
      facility_id,
      dispatch,
      statuses,
    ]
  );

  const handleChange = (name, value) => {
    setStatuses((prev) => {
      const newStatuses = { ...prev, [name]: value };
      if (value === "Estimated") return newStatuses;
      if (
        value === "Verified" ||
        (prev[name] === "Verified" && value === "Submitted")
      ) {
        handleSaveSavingsReport(newStatuses);
      }
      return newStatuses;
    });
  };

  const getFields = () => {
    if (meter_type === 1) {
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
        // {
        //   name: "incremental_yoy_savings ",
        //   label: "Incremental year-over-year electricity savings (kWh) ",
        // },
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

  // check if the data provided is available till that particular P4P end date [keep the below logic for future reference if other one doesn't work]
  // const getMaxDate = useMemo(() => {
  //   const endDate = p4PStartEndDates.endDate
  //     ? parseISO(p4PStartEndDates.endDate)
  //     : null;
  //   const maxDataDate = adminPerformanceDataMinMaxDate
  //     ? (adminPerformanceDataMinMaxDate.max_date)
  //     : null;

  //   if (endDate && maxDataDate) {
  //     return endDate > maxDataDate ? endDate : maxDataDate;
  //   } else {
  //     return endDate || maxDataDate || null;
  //   }
  // }, [p4PStartEndDates.endDate, adminPerformanceDataMinMaxDate?.max_date]);

  const [isDataNotAvailable, setIsDataNotAvailable] = useState(false);
  const [maxDate, setMaxDate] = useState(null);

  // Parse dates
  const parsedP4pEndDate = useMemo(
    () =>
      p4PStartEndDates?.endDate ? parseISO(p4PStartEndDates.endDate) : null,
    [p4PStartEndDates?.endDate]
  );

  const parsedDataAvailableUntil = useMemo(
    () =>
      adminPerformanceDataMinMaxDate?.max_date
        ? parse(
            adminPerformanceDataMinMaxDate.max_date,
            "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
            new Date()
          )
        : null,
    [adminPerformanceDataMinMaxDate?.max_date]
  );

  // Effect for date comparison and state updates
  useEffect(() => {
    if (isValid(parsedP4pEndDate) && isValid(parsedDataAvailableUntil)) {
      if (isBefore(parsedP4pEndDate, parsedDataAvailableUntil)) {
        setMaxDate(parsedP4pEndDate);
        setIsDataNotAvailable(false);
      } else {
        setMaxDate(parsedDataAvailableUntil);
        setIsDataNotAvailable(true);
      }
    } else if (isValid(parsedP4pEndDate)) {
      setMaxDate(parsedP4pEndDate);
      setIsDataNotAvailable(false);
    } else if (isValid(parsedDataAvailableUntil)) {
      setMaxDate(parsedDataAvailableUntil);
      setIsDataNotAvailable(true);
    } else {
      setMaxDate(null);
      setIsDataNotAvailable(false);
    }
  }, [parsedP4pEndDate, parsedDataAvailableUntil]);

  const data = [
    {
      metric: "Pay-for-performance period",
      value: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <Tooltip title="Refresh calculation">
            <span>
              <IconButton
                sx={{
                  background: "#2e813e",
                  color: "#FFF",
                  ":hover": { color: "#FFF", background: "#1e6329" },
                  transition: "all 0.3s",
                }}
                onClick={handleRefreshCalculation}
                disabled={selectedEndDate === null}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          {p4PStartEndDates?.startDate
            ? `From ${format(p4PStartEndDates.startDate, "MM-dd-yyyy")}, to`
            : "N/A"}
        </Box>
      ),
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
          maxDate={new Date(maxDate)}
          minDate={
            p4PStartEndDates.startDate
              ? parseISO(p4PStartEndDates.startDate)
              : null
          }
          slotProps={{
            textField: {
              readOnly: true,
            },
          }}
        />
      ),
    },
    ...fields.map((field) => {
      const value = formData[field.name] && formatNumber(formData[field.name]);
      const displayValue = value === 0 ? 0 : value || "-";
      return {
        metric: field.label,
        value: displayValue,
        unit: (
          <SelectBox
            name={field.name}
            options={standardOptions.map((option) => ({
              value: option,
              name: option,
            }))}
            value={statuses[field.name] || "Estimated"}
            onChange={handleChange}
            disabled={
              p4PStartEndDates?.endDate
                ? !isEqual(selectedEndDate, parseISO(p4PStartEndDates?.endDate))
                : null
            }
          />
        ),
      };
    }),
    {
      metric: "Performance incentive payment status",
      value: "-",
      unit: (
        <SelectBox
          name="payment_status"
          options={paymentStatusOptions}
          value={p4pIncentiveStatus || "Under-review"}
          onChange={() => {}}
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
      {isDataNotAvailable && (
        <CommonDataAvailabilityAlert p4pEndDate={p4PStartEndDates?.endDate} isAdmin />
      )}
      <Formik
        innerRef={formikRef}
        initialValues={formData}
        onSubmit={handleSaveSavingsReport}
        enableReinitialize
      >
        <Form className="savings-report-table">
          <MiniTable columns={columns} data={data} firstChildColored={true} />
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
