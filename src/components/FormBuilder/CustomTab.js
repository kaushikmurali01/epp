import { Tab, styled, useTheme } from "@mui/material";

const CustomTab = styled(Tab)(() => {
  const { palette } = useTheme();

  return {
    "&.Mui-selected": {
      backgroundColor: palette.button.primary,
      color: "white",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: "lightgray",
      color: palette.text.primary,
    },
  };
});

export default CustomTab;
