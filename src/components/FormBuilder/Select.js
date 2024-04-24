import React from 'react';
import { TextField, MenuItem, FormControl, FormLabel } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const SelectBox = ({
  name,
  label,
  options,
  ...otherProps
}) => {

  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = evt => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <FormControl sx={{ width: "100%" }} >
      <FormLabel sx={{ color: '#2E813E' }}>{label}</FormLabel>
      <TextField {...configSelect}>
        {options && Object.keys(options).map((item, pos) => {
          return (
            <MenuItem key={pos} value={item}>
              {options[item]}
            </MenuItem>
          )
        })}
      </TextField>
    </FormControl>
  );
};

export default SelectBox;
