import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';

const OurClient = () => {
    const {getTheme,theme_Md,theme_Sm } = useMediaQueries();

    const clientRowGridStyle = {
        padding: '0',
        gap: '1.5rem',
        justifyContent: "center",  
        [getTheme.breakpoints.up('sm')]: {
            gap: '2rem',
        },
        [getTheme.breakpoints.up('md')]: {
            justifyContent: 'flex-start', 
            padding: '0 2%',
        },
    }
    const clientGridBoxStyle = {
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        width: '46%',
        maxHeight: "6.563rem",
        padding: '1rem',
        maxWidth: "12.188rem",
        justifyContent: "center",  
        [getTheme.breakpoints.up('sm')]: {
            width: '16%',
            justifyContent: "space-between",  
        },
        [getTheme.breakpoints.up('md')]: {
            width: '17%',
            justifyContent: "center",  
        },
    }
    return (
        <Box component={'section'} className='our-client-section common-section' sx={{ bgcolor: 'dark.light' }}>
            <Container maxWidth="lg">

                <Grid container  className='heading-row' sx={{justifyContent: theme_Sm ? 'flex-start' : 'center'}}>
                    <Grid item sx={{padding: theme_Md ? '0 4%' : '0', textAlign: theme_Sm ? 'left' : 'center'}} >
                        <Typography variant="h3" sx={{color: "primary.contrastText"}}>
                            Trusted By Businesses Across Ontario
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container  className='our-client-row' sx={{ ...clientRowGridStyle}} >
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