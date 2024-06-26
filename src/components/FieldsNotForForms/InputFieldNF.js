import React from 'react';
import { TextField,FormControl, FormLabel } from '@mui/material';
import { FormGroup } from "@mui/material";


const InputFieldNF = ({name, label, isDisabled, ...otherProps}) => {


  const configTextfield = {
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
  };

  return (
    <FormGroup className='theme-form-group'>
      {label && <FormLabel>{label}</FormLabel> }
      <FormControl className='theme-form-control'>
        <TextField {...configTextfield} disabled={isDisabled} />
      </FormControl>
    </FormGroup>
  );
};

export default InputFieldNF;
