import React from 'react';
import {Box} from '@mui/material';

import LoginForm from '../../components/Onboarding/LoginForm';
const Login = () => {
   
    return (
        <React.Fragment>
                <Box component="div" 
                    sx={{ 
                        width: {md:'100%', xs:'100%'},
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent:'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginTop:"250px",
                    }}
                >

                    <LoginForm />
                    
                </Box>
        </React.Fragment>
    )
}

export default Login;
