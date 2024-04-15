import React from 'react';
import { TextField,FormControl } from '@mui/material';
import { useField } from 'formik';

const InputField = ({name,...otherProps}) => {
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

  // console.log(field, "check formik values");

  return (
    <FormControl sx={{width: '100%', mb:3}}>
      <TextField {...configTextfield} />
    </FormControl>
  );
};

export default InputField;
