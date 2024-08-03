import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Slider, Typography } from "@mui/material";
import {
  format,
  addDays,
  differenceInDays,
  parseISO,
  isValid,
  min,
  subYears,
} from "date-fns";

const DateRangeSlider = ({
  start_date,
  end_date,
  sliderStartDate,
  sliderEndDate,
  startLabel = "Start",
  endLabel = "End",
  onChange,
  disabled = false,
}) => {
  const parseDate = useCallback((dateString) => {
    if (!dateString) return new Date();
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : new Date(dateString);
  }, []);

  const startDateObj = parseDate(start_date);
  const endDateObj = parseDate(end_date);
  const sliderStartDateObj = parseDate(sliderStartDate);
  const sliderEndDateObj = parseDate(sliderEndDate);
  const today = new Date();
  const totalDays = differenceInDays(today, startDateObj);
  const startDaysOffset = differenceInDays(sliderStartDateObj, startDateObj);
  const endDaysOffset = differenceInDays(sliderEndDateObj, startDateObj);
  const maxEndDays = differenceInDays(endDateObj, startDateObj);

  const [range, setRange] = useState([startDaysOffset, endDaysOffset]);
  const [isThumbActive, setIsThumbActive] = useState(false);
  const oneYearBeforeEnd = subYears(endDateObj, 1);
  const oneYearInDays = differenceInDays(endDateObj, oneYearBeforeEnd);

  useEffect(() => {
    setRange([startDaysOffset, endDaysOffset]);
  }, [startDaysOffset, endDaysOffset]);

  const formatDate = useCallback(
    (value) => {
      const date = addDays(startDateObj, value); // Add 1 to compensate for the day difference
      return format(date, "yyyy-MM-dd");
    },
    [startDateObj]
  );

  const formatValueLabel = useCallback(
    (value, index) => (
      <div style={{ textAlign: "center" }}>
        <Typography variant="caption" display="block">
          {index === 0 ? startLabel : endLabel}
        </Typography>
        <Typography variant="body2">{formatDate(value)}</Typography>
      </div>
    ),
    [formatDate, startLabel, endLabel]
  );

  const handleChange = useCallback(
    (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }

      let updatedRange = [...newValue];

      // Ensure both values are within the valid range
      updatedRange = updatedRange.map((value) => Math.min(value, maxEndDays));

      // Ensure minimum 1 day between start and end
      const minDistance = 1;
      if (activeThumb === 0) {
        updatedRange[0] = Math.min(
          updatedRange[0],
          updatedRange[1] - minDistance
        );
      } else {
        updatedRange[1] = Math.max(
          updatedRange[1],
          updatedRange[0] + minDistance
        );
      }

      setRange(updatedRange);
    },
    [maxEndDays]
  );

  const handleMouseDown = useCallback(
    (event) => {
      // Check if the click is within the valid range
      const clickX = event.clientX - event.target.getBoundingClientRect().left;
      const sliderWidth = event.target.clientWidth;
      const clickPosition = (clickX / sliderWidth) * totalDays;

      if (clickPosition <= maxEndDays) {
        setIsThumbActive(true);
      }
    },
    [maxEndDays, totalDays]
  );

  const handleMouseUp = useCallback(() => {
    setIsThumbActive(false);
    if (onChange) {
      // Ensure the range is within the valid bounds before calling onChange
      const validRange = [
        Math.min(range[0], maxEndDays),
        Math.min(range[1], maxEndDays),
      ];
      onChange(formatDate(validRange[0]), formatDate(validRange[1]));
    }
  }, [onChange, range, formatDate, maxEndDays]);

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <Slider
        value={range}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        valueLabelDisplay="on"
        valueLabelFormat={formatValueLabel}
        disableSwap
        min={0}
        max={totalDays}
        step={1}
        disabled={disabled}
        marks={[
          {
            value: 0,
            label: format(startDateObj, "yyyy-MM-dd"),
          },
          {
            value: totalDays,
            label: format(today, "yyyy-MM-dd"),
          },
        ]}
        sx={{
          "& .MuiSlider-valueLabel": {
            background: "white",
            color: "black",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            "&:before": {
              display: "none",
            },
          },
          "& .MuiSlider-thumb": {
            backgroundColor: isThumbActive ? "#4CAF50" : "#2E813E",
            border: "2px solid white",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 8px rgba(46, 129, 62, 0.16)",
            },
          },
          "& .MuiSlider-track": {
            backgroundColor: "#2E813E",
            border: "none",
          },
          "& .MuiSlider-rail": {
            backgroundColor: (theme) => `${theme.palette.grey[300]}`,
            opacity: 1,
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: `${(maxEndDays / totalDays) * 100}%`,
              backgroundColor: (theme) => `${theme.palette.grey[100]}`,
              pointerEvents: "none",
            },
          },
          "& .MuiSlider-mark": {
            backgroundColor: "transparent",
            height: "6px",
            width: "6px",
            borderRadius: "50%",
          },
          "& .MuiSlider-markLabel": {
            color: "#989898",
          },
        }}
      />
    </div>
  );
};

DateRangeSlider.propTypes = {
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  sliderStartDate: PropTypes.string.isRequired,
  sliderEndDate: PropTypes.string.isRequired,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default DateRangeSlider;
