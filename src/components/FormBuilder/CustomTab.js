import { Tab, styled, useTheme } from "@mui/material";

const CustomTab = styled(Tab)((props) => {
  console.log(props)
  const { palette } = useTheme();

  return {
    "&.Mui-selected": {
      backgroundColor: palette.button.primary,
      color: "white",
    },
    "&:not(.Mui-selected)": {
      backgroundColor: props?.pageName == 'Homepage' ? '#ffffff' : 'lightgray',
      color: palette.text.primary,
    },
  };
});

export default CustomTab;
