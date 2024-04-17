import React from "react";
import { TextField, FormControl, Input } from "@mui/material";
// or
import { FormGroup } from "@mui/material";
import { useField } from "formik";

const InputField = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <FormGroup>
      <FormControl>
        <TextField {...configTextfield} />
      </FormControl>
    </FormGroup>
  );
};

export default InputField;
