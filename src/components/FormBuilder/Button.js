import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useFormikContext } from 'formik';

const ButtonWrapper = ({ children, variant, width, height, edit, ...otherProps }) => {
  const [buttonState, setButtonState] = useState(false);
  const formikProps = useFormikContext();


  const configButton = {
    ...otherProps,
    variant: variant || 'contained',
  }

  useEffect(() => {
    if (Object.keys(formikProps.errors).length === 0 && formikProps.dirty) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  }, [formikProps.errors, formikProps.values, formikProps.dirty]);

  return (
    <Button
      {...configButton}
      sx={{ width: width, height: height }}
      disabled={!buttonState}
      onClick={()=> formikProps.submitForm}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;
