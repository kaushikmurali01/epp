import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';

const OurClient = () => {
    const {getTheme,theme_Md,theme_Lg } = useMediaQueries();

    const clientRowGridStyle = {
        // padding: 0,
        gap: '2rem',
        justifyContent: 'center',
    }
    const clientGridBoxStyle = {
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        width: '33%',
        maxHeight: "6.563rem",
        padding: '1rem',
        maxWidth: "12.188rem",
        // marginBottom: '2rem',
        [getTheme.breakpoints.up('sm')]: {
            width: '17%',
            justifyContent: "center",  
        },
        [getTheme.breakpoints.up('lg')]: {
            
         
        },
    }
    return (
        <Box component={'section'} className='our-client-section common-section' sx={{ bgcolor: 'dark.light' }}>
            <Container maxWidth="lg">

                <Grid container justifyContent="space-between" className='heading-row'>
                    <Grid container item xs={12} justifyContent="center" >
                        <Typography variant="h3" className='ev-theme-heading' sx={{color: "primary.contrastText"}}>
                            Trusted By Businesses Across Ontario
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container justifyContent="space-between" className='our-client-row' sx={{ ...clientRowGridStyle}} >
                    <Grid item  sx={{...clientGridBoxStyle}} >
                        <figure>
                            <img src='/images/landingpage/ourClient/manila.svg' alt='manila' />
                        </figure>


                    </Grid>
                    <Grid item sx={{...clientGridBoxStyle}}>
                        <figure>
                            <img src='/images/landingpage/ourClient/golden_view.svg' alt='golden_view' />
                        </figure>


                    </Grid>
                    <Grid item sx={{...clientGridBoxStyle}}>
                        <figure>
                            <img src='/images/landingpage/ourClient/rubicon_point.svg' alt='rubicon_point' />
                        </figure>


                    </Grid>
                    <Grid item sx={{...clientGridBoxStyle}}>
                        <figure>
                            <img src='/images/landingpage/ourClient/swig_company.svg' alt='swig_company' />
                        </figure>


                    </Grid>
                    <Grid item sx={{...clientGridBoxStyle}}>
                        <figure>
                            <img src='/images/landingpage/ourClient/douglas_emmett.svg' alt='douglas_emmett' />
                        </figure>


                    </Grid>
                </Grid>

            </Container>
        </Box>
    )
}

export default OurClient