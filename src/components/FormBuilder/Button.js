import React from 'react';
import { Button } from '@mui/material';
import { useFormikContext } from 'formik';

const ButtonWrapper = ({ children, width, height, ...otherProps }) => {

  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  }

  const configButton = {
    ...otherProps,
    variant: 'contained',
    fullWidth: true,
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
