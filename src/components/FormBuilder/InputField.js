import React, { useEffect, useState } from 'react';
import { TextField, FormControl, FormLabel } from '@mui/material';
import { FormGroup } from "@mui/material";
import { useField } from "formik";

const InputField = ({ name, label, isDisabled, ...otherProps }) => {
  const [field, meta] = useField(name);
  const [labelText, setLabelText] = useState('');
  const [asterisk, setIsAsterisk] = useState(false);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
  };

  useEffect(() => {
    if (label?.includes('*')) {
      setLabelText(label.split('*'));
      setIsAsterisk(label.includes('*'));
    } else {
      setLabelText(label);
    }
  }, [labelText]);

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <FormGroup className='theme-form-group'>
      {label && <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FormLabel>{labelText}</FormLabel>
          {asterisk ? <span className="asterisk">*</span> : null}
        </div>
      </>}
      <FormControl className='theme-form-control'>
        <TextField {...configTextfield} disabled={isDisabled} />
      </FormControl>
    </FormGroup>
  );
};

export default InputField;
