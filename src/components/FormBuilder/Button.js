import React from 'react';
import { Button } from '@mui/material';
import { useFormikContext } from 'formik';

const ButtonWrapper = ({ children, variant, width, height, ...otherProps }) => {

  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  }

  const configButton = {
    ...otherProps,
    variant: variant || 'contained',
    onClick: handleSubmit
  }

  return (
    <Button
      {...configButton}
      sx={{ width: width, height: height }}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;


// variant props value = "outlined", "contained"