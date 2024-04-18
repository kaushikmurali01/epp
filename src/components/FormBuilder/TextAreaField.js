// import React from 'react';
// import { TextareaAutosize } from '@mui/base';
// import { useField } from 'formik';

// const TextAreaField = ({name,...otherProps}) => {
//     const [field, meta] = useField(name);
//   const configTextfield = {
//     ...field,
//     ...otherProps,
//     variant: 'outlined',
//     fullWidth: true,
//     multiline: true,

//   };


//   if (meta && meta.touched && meta.error) {
//     configTextfield.error = true;
//     configTextfield.helperText = meta.error;
//   }

//   return (
//     <TextareaAutosize {...configTextfield} xs={12} minRows={3}  placeholder="Minimum 3 rows" />
//     // <Textarea aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
//   );
// };

// export default TextAreaField;



import React from 'react';
import {Box, FormControl, FormGroup, FormLabel,FormHelperText } from '@mui/material';
import { useField } from 'formik';

const TextAreaField = ({name,label,...otherProps}) => {
    const [field, meta] = useField(name);
  const configTextfield = {
    ...field,
    ...otherProps,
    // multiline: true,
   

  };


  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  return (
    <FormGroup >
    <FormControl>
    <FormLabel> {label} </FormLabel>
    <textarea  {...configTextfield} />
    <FormHelperText error={configTextfield.error} margin={0} >{configTextfield.helperText}</FormHelperText>
    </FormControl>
    </FormGroup>
  );
};

export default TextAreaField;
