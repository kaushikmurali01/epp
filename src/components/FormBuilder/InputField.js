import React from 'react';
import { TextField,FormControl, FormLabel } from '@mui/material';
// or
import { FormGroup } from '@mui/material';
import { useField } from 'formik';

const InputField = ({name, label,...otherProps}) => {
    const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined'
  };


  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <FormGroup >
      <FormControl>
        <FormLabel> {label} </FormLabel>
        <TextField {...configTextfield} />
      </FormControl>
    </FormGroup>
  );
};

export default InputField;
