import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const CustomBox = ({
    heading,
    label,
    color,
    border,
    image,
    ...otherProps
}) => {

    return (
        <>
        {/* <Box sx={{ color: color, fontWeight: '600', fontSize: '18px', maxWidth: '40px !important', height: '40px', borderRadius: '9px' }}>1</Box> */}
        <Grid item xs={6} sx={{ border: border, padding: '1rem !important', maxWidth: '544px !important', height: '100px', borderRadius: '9px', margin: '10px' }}>
            <Grid container sx={{ marginTop: '10px' }}>
                <Grid item xs={2}>
                    <img src={image} alt='account-info' />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: color, fontWeight: '600', fontSize: '18px' }}>
                        {heading}
                    </Typography>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ color: color, fontWeight: '400', fontSize: '16px' }}>
                        {label}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        </>
    );
};

export default CustomBox;
