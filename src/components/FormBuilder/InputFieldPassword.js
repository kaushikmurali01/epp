import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  FormGroup,
  FormLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useField } from "formik";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const InputFieldPassword = ({
  name,
  label,
  showpasswordHints,
  isLabelBlack,
  isRequiredField,
  ...otherProps
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    type: showPassword ? "text" : "password",
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormGroup
      className={`theme-form-group password-field-group ${
        configTextfield.error ? "has-error" : ""
      } `}
    >
      <FormControl>
        {label && (
          <FormLabel sx={{ color: isLabelBlack ? "#54585A" : "#2E813E" }}>
            {label}
            {isRequiredField ? <span style={{ color: "#F00" }}>*</span> : null}
          </FormLabel>
        )}
        <div className="form-field">
          <TextField
            {...configTextfield}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error ? meta.error : ""}
          />
        </div>
      </FormControl>
    </FormGroup>
  );
};

export default InputFieldPassword;
