import React, { useEffect, useState } from "react";
import { Slider, Typography } from "@mui/material";
import { format, addDays, differenceInDays } from "date-fns";

const DateRangeSlider = ({
  start_date,
  end_date,
  startLabel = "Start",
  endLabel = "End",
}) => {
  const totalDays = differenceInDays(new Date(end_date), new Date(start_date));
  const [range, setRange] = useState([0, totalDays]);

  useEffect(() => {
    setRange([0, totalDays]);
  }, [start_date, end_date, totalDays]);

  const formatDate = (value) => {
    const date = addDays(new Date(start_date), value);
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
    if (activeThumb === 0) {
      setRange([Math.min(newValue[0], range[1] - 1), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue[1], range[0] + 1)]);
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
        max={totalDays}
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
