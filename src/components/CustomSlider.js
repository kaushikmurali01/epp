import { Slider, styled, useTheme } from "@mui/material";

const CustomSlider = styled(Slider)(({ value }) => {
  const { palette } = useTheme();
  let color;
  if (value < 20) {
    color = palette.slider.low;
  } else if (value >= 20 && value < 50) {
    color = palette.slider.medium;
  } else if (value >= 50 && value <= 100) {
    color = palette.slider.high;
  }

  return {
    height: ".625rem",
    width: "3.042rem",
    "& .MuiSlider-track": {
      backgroundColor: color,
      border: "none",
    },
    "& .MuiSlider-thumb": {
      display: "none",
    },
    '& .MuiSlider-rail': {
        backgroundColor: palette.slider.background,
    },
    cursor: "default",
  };
});

export default CustomSlider;
