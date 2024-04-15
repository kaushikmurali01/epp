import React, { useState, useEffect } from "react";
import { TextField,FormControl } from '@mui/material';
import { useField } from "formik";

const InputFieldPassword = ({ name, type, ...otherProps }) => {
  const [pwdError, setPwdError] = useState({});
  const [field, meta] = useField(name);
  const configTextfield = {
    ...field,
    ...otherProps,
  };

  const [inputType, setinputType] = useState(type);

  if (meta && meta.touched && meta.error) {
    configTextfield.invalid = "true";
    configTextfield.text = meta.error;
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

  return (
    <FormControl sx={{width: '100%', mb:3}}>
      <div className="form-field">
       <TextField {...configTextfield} />

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

        {/* <label className="flag">{label}</label> */}
      </div>

      <div className="err">
        <ul>
          <li
            className={`${
              configTextfield.value.length === 0 
                ? ""
                :  pwdError.hasMinumLength
                ? "valid"
                : "in-valid"
            }`}
          >
            8 Characters -
          </li>
          <li
            className={`${
              configTextfield.value.length === 0
                ? ""
                : pwdError.hasUpperCase
                ? "valid"
                : "in-valid"
            }`}
          >
            1 Uppercase -
          </li>
          <li
            className={`${
              configTextfield.value.length === 0
                ? ""
                : pwdError.hasLowerCase
                ? "valid"
                : "in-valid"
            }`}
          >
            1 Lowercase -
          </li>
          <li
            className={`${
              configTextfield.value.length === 0
                ? ""
                : pwdError.hasNumber
                ? "valid"
                : "in-valid"
            }`}
          >
            1 Number 
          </li>
         
        </ul>
      </div>
    </FormControl>
  );
};

export default InputFieldPassword;
