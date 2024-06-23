import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";
import { format, addDays, addYears, differenceInDays, differenceInMonths, differenceInYears, subMonths, subYears } from "date-fns";

const DateRangeSlider = () => {
  // Set up initial dates
  const today = new Date();
  const initialStartDate = today;
  const oneYearFromToday = addYears(today, 1);
  const initialEndDate = addDays(today, 7);

  // Convert initial dates to timestamps
  const [dateRange, setDateRange] = useState([
    initialStartDate.getTime(),
    // initialEndDate.getTime(),
    oneYearFromToday.getTime(),
  ]);

  // Handle slider change
  const handleSliderChange = (event, newValue) => {
    setDateRange(newValue);
  };

  // Format timestamps back to readable dates
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);

  const marks = [
    {
      value: today.getTime(),
      label: format(today, "yyyy-MM-dd"),
    },
    {
      value: oneYearFromToday.getTime(),
      label: format(oneYearFromToday, "yyyy-MM-dd"),
    },
  ];

  // Calculate precise differences
  const calculateDifference = (start, end) => {
    let yearsDifference = differenceInYears(end, start);
    const adjustedEndForMonths = subYears(end, yearsDifference);
    let monthsDifference = differenceInMonths(adjustedEndForMonths, start);
    const adjustedEndForDays = subMonths(
      adjustedEndForMonths,
      monthsDifference
    );
    const daysDifference = differenceInDays(adjustedEndForDays, start);

    return {
      years: yearsDifference,
      months: monthsDifference,
      days: daysDifference,
    };
  };

  const { years, months, days } = calculateDifference(startDate, endDate);

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Typography gutterBottom>
        Date Range: {format(startDate, "yyyy-MM-dd")} -{" "}
        {format(endDate, "yyyy-MM-dd")}
      </Typography>
      <Typography gutterBottom>
        Difference: {years} years, {months} months,{" "}
        {days} days
      </Typography>
      <Slider
        value={dateRange}
        onChange={handleSliderChange}
        valueLabelDisplay="on"
        valueLabelFormat={(value) => format(new Date(value), "yyyy-MM-dd")}
        min={today.getTime()}
        // max={addDays(today, 30).getTime()} // Example: range of 30 days
        max={oneYearFromToday.getTime()}
        step={24 * 60 * 60 * 1000} // Step is one day
        marks={marks}
      />
    </div>
  );
};

export default DateRangeSlider;
