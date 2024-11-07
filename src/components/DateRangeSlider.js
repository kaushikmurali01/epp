import React, { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Grid, Slider, Typography } from "@mui/material";
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
  const [focusedThumb, setFocusedThumb] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    setRange([startDaysOffset, endDaysOffset]);
  }, [startDaysOffset, endDaysOffset]);

  const formatDate = useCallback(
    (value) => {
      const date = addDays(startDateObj, value);
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
      updatedRange = updatedRange.map((value) => Math.min(value, maxEndDays));

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
      const validRange = [
        Math.min(range[0], maxEndDays),
        Math.min(range[1], maxEndDays),
      ];
      onChange(formatDate(validRange[0]), formatDate(validRange[1]));
    }
  }, [onChange, range, formatDate, maxEndDays]);

  const handleKeyDown = useCallback(
    (event) => {
      if (
        disabled ||
        (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
      ) {
        return;
      }

      event.preventDefault();
      const step = event.key === "ArrowLeft" ? -1 : 1;
      const newRange = [...range];

      if (focusedThumb === 0 || focusedThumb === 1) {
        newRange[focusedThumb] = Math.max(
          0,
          Math.min(newRange[focusedThumb] + step, maxEndDays)
        );

        // Ensure minimum distance between thumbs
        if (focusedThumb === 0) {
          newRange[0] = Math.min(newRange[0], newRange[1] - 1);
        } else {
          newRange[1] = Math.max(newRange[1], newRange[0] + 1);
        }

        setRange(newRange);
        onChange(formatDate(newRange[0]), formatDate(newRange[1]));
      }
    },
    [disabled, range, focusedThumb, maxEndDays, onChange, formatDate]
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("keydown", handleKeyDown);
      return () => {
        slider.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return (
    <Grid sx={{ width: {xs: "75%", md: "87%"}, margin: "auto" }} ref={sliderRef} tabIndex="0">
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
        onFocus={(event) => {
          const thumb = event.target.getAttribute("data-index");
          setFocusedThumb(thumb !== null ? parseInt(thumb, 10) : null);
        }}
        onBlur={() => setFocusedThumb(null)}
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
            backgroundColor: disabled
              ? "#E0E0E0"
              : isThumbActive
              ? "#4CAF50"
              : "#2E813E",
            border: "2px solid white",
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 8px rgba(46, 129, 62, 0.16)",
            },
          },
          "& .MuiSlider-track": {
            backgroundColor: disabled ? "#2E813E80" : "#2E813E",
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
    </Grid>
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
