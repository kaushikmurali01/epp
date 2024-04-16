import React, { useState, useEffect } from "react";
import { TextField,FormControl, FormGroup, List,ListItem } from '@mui/material';
import { useField } from "formik";

const InputFieldPassword = ({ name, type, showpasswordHints, ...otherProps }) => {
  const [pwdError, setPwdError] = useState({});
  const [field, meta] = useField(name);
  const configTextfield = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined'
  };

  const [inputType, setinputType] = useState(type);

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  useEffect(() => {
    const hasMinumLength = /^.{8,}$/.test(configTextfield.value);
    const hasUpperCase = /[A-Z]/.test(configTextfield.value);
    const hasLowerCase = /[a-z]/.test(configTextfield.value);
    const hasNumber = /\d/.test(configTextfield.value);
    

    setPwdError({
      ...pwdError,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
     
      hasMinumLength,
    });
  }, [configTextfield.value]);

  console.log(configTextfield, "configTextfield")
  return (
    <FormGroup className={`ev-password-field-group ${
      configTextfield.error
        ? "has-error"
        : ""
    } `}>
    <FormControl>
      <div className="form-field">
       <TextField {...configTextfield} type={inputType} xs={12} />

        {configTextfield.showeyeicon === "true" ? (
          <span
            className="eye-icon"
            onClick={() => {
              if (
                inputType === "password" &&
                configTextfield.showeyeicon === "true"
              ) {
                setinputType("text");
              } else {
                setinputType("password");
              }
            }}
          >
            {inputType !== "password" ? (
              <img  width="24"  height="29" src="/images/eyeShow.svg" alt="eye-Show" />
            ) : (
              <img width="24"  height="22" src="/images/eyeCrossed.svg" alt="eye-Crossed" />
            )}
          </span>
        ) : null}
      </div>
      </FormControl>

    {showpasswordHints === "true"  &&     
      <List 
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap:'8px'
          }}
          className="error-list"
        >
          <ListItem
          sx={{ width: 'auto', padding: '0' }}
            className={`${
              configTextfield.value.length === 0 
                ? ""
                :  pwdError.hasMinumLength
                ? "valid"
                : "invalid"
            }`}
          >
            8 Characters -
          </ListItem>
          <ListItem
          sx={{ width: 'auto', padding: '0' }}
            className={`${
              configTextfield.value.length === 0
                ? ""
                : pwdError.hasUpperCase
                ? "valid"
                : "in-valid"
            }`}
          >
            1 Uppercase -
          </ListItem>
          <ListItem
          sx={{ width: 'auto', padding: '0' }}
            className={`${
              configTextfield.value.length === 0
                ? ""
                : pwdError.hasLowerCase
                ? "valid"
                : "in-valid"
            }`}
          >
            1 Lowercase -
          </ListItem>
          <ListItem
          sx={{ width: 'auto', padding: '0' }}
            className={`${
              configTextfield.value.length === 0
                ? ""
                : pwdError.hasNumber
                ? "valid"
                : "in-valid"
            }`}
          >
            1 Number 
          </ListItem>
         
      </List>
      }

    
    </FormGroup>
  );
};

export default InputFieldPassword;
