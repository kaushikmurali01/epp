import React from 'react';
import {
  Radio,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel
} from '@mui/material';
import { useField, useFormikContext } from 'formik';

const RadioWrapper = ({
  name,
  label,
  value,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = evt => {
    const { checked } = evt.target;
    setFieldValue(name, checked);
  };

  const configRadio = {
    ...field,
    onChange: handleChange
  };

  const configFormControl = {};
  if (meta && meta.touched && meta.error) {
    configFormControl.error = true;
  }

  return (
    <FormControl {...configFormControl}>
      <FormGroup>
        <FormControlLabel
          control={<Radio {...configRadio} />}
          name={name}
          label={label}
          value={value}
        />
      </FormGroup>
    </FormControl>
  );
};

export default RadioWrapper;
