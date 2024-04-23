import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

const CustomBox = ({
    heading,
    label,
    color,
    border,
    image,
    count,
    ...otherProps
}) => {

    return (
        <>
            <Grid item xs={6}>
                <Grid container>
                {count == '3' || count == '4' ? <Grid item xs={1}></Grid> : null }
                    <Grid item xs={1} sx={{ marginTop: '40px' }}>
                        <Box sx={{ backgroundColor: count == 1 ? color : '#2E813E1A', color: count == 1 ? '#ffffff' : '#54585A', fontWeight: '600', fontSize: '18px', maxWidth: '40px !important', height: '40px', borderRadius: '9px', display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>{count}</Box>
                    </Grid>
                    <Grid item xs={count == '3' || count == '4' ? 10 : 11}>
                        <Grid container sx={{ border: border, padding: '1rem !important', maxWidth: '544px !important', height: '100px', borderRadius: '9px', margin: '10px' }}>
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
                </Grid>
            </Grid>
        </>
    );
};

export default CustomBox;
