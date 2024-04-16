import React from 'react';
import {Box} from '@mui/material';
import SignUpForm from '../../components/Onboarding/SignUpForm';


const Signup = () => {
   
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

                    <SignUpForm />
                    
                </Box>
        </React.Fragment>
    )
}

export default Signup;
