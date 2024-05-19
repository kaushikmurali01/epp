import React from 'react';
import { TextField, MenuItem, FormControl, FormLabel, FormGroup } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const SelectBox = ({
  name,
  label,
  options,
  valueKey,
  labelKey,
  onChange,
  ...otherProps
}) => {

  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = evt => {
    const { value } = evt.target;
    setFieldValue(name, value);
    if(onChange) onChange(evt)
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    value: field?.value || '', // Initialize value prop with an empty string if undefined
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <FormGroup className='theme-form-group theme-select-form-group' key={name}>
    <FormControl sx={{ width: "100%" }} >
      <FormLabel >{label}</FormLabel>
      <TextField {...configSelect}>
        {options?.length ? options.map((item) => (
          <MenuItem key={item[valueKey]} value={item?.[valueKey] || ''}>
            {item[labelKey]}
          </MenuItem>
        )) : null}
      </TextField>
    </FormControl>
    </FormGroup>
  );
};

SelectBox.defaultProps = {
  valueKey: 'id', // default value key
  labelKey: 'name', // default label key
};

export default SelectBox;
