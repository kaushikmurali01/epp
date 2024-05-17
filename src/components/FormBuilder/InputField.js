import React from 'react';
import { TextField,FormControl, FormLabel } from '@mui/material';
import { FormGroup } from "@mui/material";
import { useField } from "formik";

const InputField = ({name, label, isDisabled, ...otherProps}) => {
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
    <FormGroup className='theme-form-group'>
      {label && <FormLabel>{label}</FormLabel> }
      <FormControl className='theme-form-control'>
        <TextField {...configTextfield} disabled={isDisabled} />
      </FormControl>
    </FormGroup>
  );
};

export default InputField;
