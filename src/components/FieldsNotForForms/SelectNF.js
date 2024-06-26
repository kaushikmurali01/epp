import React from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  FormGroup,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

const SelectBoxNF = ({
  name,
  label,
  options,
  valueKey,
  labelKey,
  onChange,
  ...otherProps
}) => {
  const handleChange = (evt) => {
    const { value } = evt.target;
    if (onChange) onChange(evt);
  };

  const configSelect = {
    ...otherProps,
    select: true,
    variant: "outlined",
    fullWidth: true,
    onChange: handleChange,
    // onBlur: handleBlur
  };

  return (
    <FormGroup className="theme-form-group theme-select-form-group" key={name}>
      <FormControl sx={{ width: "100%" }}>
        <FormLabel>{label}</FormLabel>
        <TextField {...configSelect}>
          {options?.length
            ? options.map((item) => (
                <MenuItem key={item[valueKey]} value={item?.[valueKey] || ""}>
                  {item[labelKey]}
                </MenuItem>
              ))
            : null}
        </TextField>
      </FormControl>
    </FormGroup>
  );
};

SelectBoxNF.defaultProps = {
  valueKey: "id", // default value key
  labelKey: "name", // default label key
};

export default SelectBoxNF;
