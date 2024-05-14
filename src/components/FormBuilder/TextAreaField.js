import React from 'react';
import {Box, FormControl, FormGroup, FormLabel,FormHelperText, TextareaAutosize } from '@mui/material';
import { useField } from 'formik';

const TextAreaField = ({name,label,...otherProps}) => {
    const [field, meta] = useField(name);
  const configTextfield = {
    ...field,
    ...otherProps,
    // multiline: true,
   

  };


  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <FormGroup className={`theme-form-group text-area-form-group ${configTextfield.error ? 'has-error' : ''} `}>
    <FormControl>
    <FormLabel> {label} </FormLabel>
    <textarea  {...configTextfield} style={{resize: 'none'}} />
    {/* <TextareaAutosize {...configTextfield} style={{resize:'none'}} /> */}
    <FormHelperText error={configTextfield.error} >{configTextfield.helperText}</FormHelperText>
    </FormControl>
    </FormGroup>
  );
};

export default TextAreaField;
