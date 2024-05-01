import React from 'react';
import { TextField, MenuItem, FormControl, FormLabel, FormGroup } from '@mui/material';
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
    <FormGroup className='theme-form-group' key={name}>
    <FormControl sx={{ width: "100%" }} >
      <FormLabel sx={{ color: '#2E813E' }}>{label}</FormLabel>
      <TextField {...configSelect}>
        {options && (options).map((item) => {
          return (
            <MenuItem key={item?.id} value={item?.name}>
              {item?.name}
            </MenuItem>
          )
        })}
      </TextField>
    </FormControl>
    </FormGroup>
  );
};

export default SelectBox;
