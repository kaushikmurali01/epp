import React, { useEffect, useState } from "react";
import { Slider, Typography } from "@mui/material";
import { format, addDays, differenceInDays, parseISO, isValid } from "date-fns";

const DateRangeSlider = ({
  start_date,
  end_date,
  startLabel = "Start",
  endLabel = "End",
  onChange,
}) => {
  const parseDate = (dateString) => {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : new Date(dateString);
  };

  const startDateObj = parseDate(start_date);
  const endDateObj = parseDate(end_date);

  const totalDays = differenceInDays(endDateObj, startDateObj) + 1;
  const [range, setRange] = useState([0, totalDays - 1]);

  useEffect(() => {
    setRange([0, totalDays - 1]);
  }, [start_date, end_date, totalDays]);

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

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    let updatedRange;
    if (activeThumb === 0) {
      updatedRange = [Math.min(newValue[0], range[1] - 1), range[1]];
    } else {
      updatedRange = [range[0], Math.max(newValue[1], range[0] + 1)];
    }
    setRange(updatedRange);
    
    if (onChange) {
      onChange(formatDate(updatedRange[0]), formatDate(updatedRange[1]));
    }
  };

  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Slider
        value={range}
        onChange={handleChange}
        valueLabelDisplay="on"
        valueLabelFormat={formatValueLabel}
        disableSwap
        min={0}
        max={totalDays - 1}
        step={1}
        sx={{
          "& .MuiSlider-valueLabel": {
            background: "white",
            color: "black",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            "&:before": {
              display: "none",
            },
          },
        }}
      />
    </div>
  );
};

export default DateRangeSlider;