import { styled } from "@mui/material";
import InputField from "./InputField";

const CustomPhoneInput = styled(InputField)(() => {
  return {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  };
});

export default CustomPhoneInput;
