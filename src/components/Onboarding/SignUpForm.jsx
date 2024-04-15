import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
    Grid, Box
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//Configure text



import TextInput from '../ReactHookFormBuilder/TextInput';


import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { validationSchemaLogIn } from '../../utils/validations/formValidation';


// Form Initial state


// Modify MUI theme
const theme = createTheme({
    palette: {
        neutral: {
            main: '#d45e68',
            contrastText: '#fff',
        },
    },
    shape: {
        borderRadius: 16,
    },
});


// Define Yup schema
// const schema = yup.object().shape({
//     firstName: yup.string().required("First name is required"),
//     lastName: yup.string().required("Last name is required"),
//   });
  

const SignUpForm = () => {

    // Login Form Submit Button.    
    // const methods = useForm();
    const methods = useForm({
        resolver: yupResolver(validationSchemaLogIn), // Integrate Yup with React Hook Form
      });
    
    const { handleSubmit } = methods;
    const onSubmit = (data) => {
        console.log(data, "onsubmit");
    };
    
    // console.log(methods, "checkMethods")


    return (
        <React.Fragment>
            <Box component="div"
                sx={{
                    width: { md: '46%', xs: '100%' },
                }}
            >

                <div className="form-box">

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextInput 
                                    name="email"
                                    label="Email"
                                    type = "email"
                                    // control={methods.control}
                                    />
                                    {/* {methods.errors.email && <div>{methods.errors.email.message}</div>} */}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextInput 
                                      name="password"
                                      label="Password"
                                      type = "password"
                                    //   control={methods.control}
                                    />
                                     {/* {methods.errors.passowrd && <div>{methods.errors.passowrd.message}</div>} */}
                                </Grid>


                                <Grid item xs={12} justifyContent="center">
                                    <ThemeProvider theme={theme}>
                                        <button type="submit">Submit</button>
                                    </ThemeProvider>
                                </Grid>
                                
                            </Grid>
                        </form>
                    </FormProvider>

                </div>

            </Box>
            {/* <Box component="div"
                sx={{
                    width: { md: '46%', xs: '100%' },
                }}
            >

                <div className="form-box">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextInput name="firstName" label="First Name" rules={{ required: 'First name is required' }} />
                        <TextInput name="lastName" label="Last Name" rules={{ required: 'Last name is required' }} />
                        <button type="submit">Submit</button>
                    </form>
                    </FormProvider>
                </div>

            </Box> */}

        </React.Fragment>
    )
}

export default SignUpForm;
