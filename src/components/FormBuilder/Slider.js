import React from 'react';
import { FormControl, FormGroup, Slider, FormHelperText } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const SliderWrapper = ({
  name,
  ...otherProps
}) => {

  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = evt => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSlider = {
    ...field,
    ...otherProps,
    value: field?.value || '', // Initialize value prop with an empty string if undefined
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSlider.error = true;
    configSlider.helperText = meta.error;
  }

  return (
    <FormGroup className='theme-form-group theme-select-form-group' key={name}>
    <FormControl sx={{ width: "100%" }} >
      <Slider  {...configSlider}/>
      <FormHelperText error={configSlider.error} >{configSlider.helperText}</FormHelperText>
    </FormControl>
    </FormGroup>
  );
};

export default SliderWrapper;
