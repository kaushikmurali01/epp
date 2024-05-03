import { Tab, styled, useTheme } from "@mui/material";

const CustomTab = styled(Tab)((props) => {
  const { palette } = useTheme();

  return {
    "&.Mui-selected": {
      backgroundColor: palette.button.primary,
      color: "#F7F7F5",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: props?.pageName == "Homepage" ? "#ffffff" : "lightgray",
      color: palette.text.primary,
    },
  };
});

export default CustomTab;
