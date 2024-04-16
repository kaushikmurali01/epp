import React from 'react';
import { TextareaAutosize } from '@mui/base';
import { useField } from 'formik';

const TextAreaField = ({name,...otherProps}) => {
    const [field, meta] = useField(name);
  const configTextfield = {
    ...field,
    ...otherProps,
    variant: 'outlined',
    fullWidth: true,
    multiline: true,

  };


  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <TextareaAutosize {...configTextfield} xs={12} minRows={3}  placeholder="Minimum 3 rows" />
    // <Textarea aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
  );
};

export default TextAreaField;
