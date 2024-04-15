import React from 'react';
import {TextField } from '@mui/material';
import { useField } from 'formik';

const TextAreaBox = ({name,...otherProps}) => {
    const [field, meta] = useField(name);
  const configTextfield = {
    ...field,
    ...otherProps,
    variant: 'outlined',
    fullWidth: true,
    multiline: true,
    rows: 4,

  };


  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <TextField {...configTextfield} />
  );
};

export default TextAreaBox;
