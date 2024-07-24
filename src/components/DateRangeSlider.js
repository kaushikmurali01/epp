import React, { useEffect, useState } from "react";
import { Slider, Typography } from "@mui/material";
import { format, addDays, differenceInDays, parseISO, isValid } from "date-fns";

const DateRangeSlider = ({
  start_date,
  end_date,
  startLabel = "Start",
  endLabel = "End",
  onChange,
  disabled = false,
}) => {
  const parseDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : new Date(dateString);
  };

  const startDateObj = parseDate(start_date);
  const endDateObj = parseDate(end_date);
  const today = new Date();
  const totalDays = differenceInDays(today, startDateObj) + 1;
  const endDaysOffset = differenceInDays(endDateObj, startDateObj);

  const [range, setRange] = useState([0, endDaysOffset]);
  const [isThumbActive, setIsThumbActive] = useState(false);

  useEffect(() => {
    setRange([0, endDaysOffset]);
  }, [start_date, end_date, totalDays, endDaysOffset]);

  const formatDate = (value) => {
    const date = addDays(startDateObj, value);
    return format(date, "yyyy-MM-dd");
  };

  const formatValueLabel = (value, index) => {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="caption" display="block">
          {index === 0 ? startLabel : endLabel}
        </Typography>
        <Typography variant="body2">{formatDate(value)}</Typography>
      </div>
    );
  };

  //if some error then use this handle change

  // const handleChange = (event, newValue, activeThumb) => {
  //   if (!Array.isArray(newValue)) {
  //     return;
  //   }
  //   let updatedRange;
  //   if (activeThumb === 0) {
  //     updatedRange = [Math.min(newValue[0], range[1] - 1), range[1]];
  //   } else {
  //     updatedRange = [range[0], Math.min(newValue[1], endDaysOffset)];
  //   }
  //   setRange(updatedRange);
  // };

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const oneYearInDays = 365;
    const currentGap = range[1] - range[0];
    let updatedRange;

    if (currentGap > oneYearInDays) {
      // If the gap is more than one year
      if (activeThumb === 0) {
        // Moving the start thumb
        const newStart = Math.min(newValue[0], endDaysOffset - oneYearInDays);
        updatedRange = [newStart, newStart + oneYearInDays];
      } else {
        // Moving the end thumb
        const newEnd = Math.min(newValue[1], endDaysOffset);
        updatedRange = [Math.max(0, newEnd - oneYearInDays), newEnd];
      }
    } else {
      // If the gap is less than or equal to one year, allow independent movement
      if (activeThumb === 0) {
        updatedRange = [Math.min(newValue[0], range[1] - 1), range[1]];
      } else {
        updatedRange = [range[0], Math.min(newValue[1], endDaysOffset)];
      }
    }

    setRange(updatedRange);
  };

  const handleMouseDown = () => {
    setIsThumbActive(true);
  };

  const handleMouseUp = () => {
    setIsThumbActive(false);
    if (onChange) {
      onChange(formatDate(range[0]), formatDate(range[1]));
    }
  };

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
        max={totalDays - 1}
        step={1}
        disabled={disabled}
        marks={[
          {
            value: 0,
            label: formatDate(0),
          },
          {
            value: totalDays - 1,
            label: formatDate(totalDays - 1),
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
            backgroundColor: "#2E813E26",
            opacity: 1,
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

export default DateRangeSlider;
