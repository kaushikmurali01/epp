import React from 'react';
import { Typography, Box, Container, Grid, Stack } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';

const HowItWorks = () => {
    const { getTheme,theme_Md } = useMediaQueries();
    const instructionRowStyles = {
        display: 'flex',
        width: '100%',
        gap: 2,
        [getTheme.breakpoints.up('sm')]: {
            width: '46%',
        },
        [getTheme.breakpoints.up('md')]: {
            flexGrow: 'inherit',
            width: 'auto',
        },
    }

    const howItWorksRowStyles = {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        gap: '10%',
    }

    return (
        <React.Fragment>
            <Box component={'section'} className='instruction-section ' sx={{ bgcolor: 'primary.light' }} >
                <Container maxWidth="lg">

                    <Grid container justifyContent="space-between" className='instruction-row'>
                        <Grid  sx={{...instructionRowStyles}} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/icon_1.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Save big on <br /> electricity bills</Typography>
                            </Stack>

                        </Grid>
                        <Grid  sx={{...instructionRowStyles}} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/icon_2.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Financial incentives <br /> and rebates from IESO</Typography>
                            </Stack>


                        </Grid>
                        <Grid  sx={{...instructionRowStyles}} alignItems="center">
                            <figure>
                                <img src='/images/landingpage/icons/icon_3.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Recognition for your <br /> sustainability efforts</Typography>
                            </Stack>


                        </Grid>
                        <Grid  sx={{...instructionRowStyles}} alignItems="center">
                            <figure>
                                <img src='/images/landingpage/icons/icon_4.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Access to technical <br /> support and resources</Typography>
                            </Stack>


                        </Grid>
                    </Grid>

                </Container>
            </Box>

            {/* How it works section  */}
            <Box component={'section'} className='how-it-work-section common-section'>
                <Container maxWidth="lg">
                    <Grid container justifyContent="space-between" className='heading-row'>
                        <Grid container item xs={12} justifyContent="center" >
                            <Typography variant="h3" className='ev-theme-heading'>
                                How it works
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className='how-it-work-row'
                    sx={{ ...howItWorksRowStyles }} 
                    >
                        <Grid sx={{width: '205px', marginBottom: '2.625rem',}} item >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_1.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Create an account and add your team</span>
                            </div>

                        </Grid>
                        <Grid sx={{width: '205px', marginBottom: '2.625rem',}} item >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_2.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Acknowledge Participant Agreement</span>
                            </div>

                        </Grid>
                        <Grid sx={{width: '205px', marginBottom: '2.625rem',}} item >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_3.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Enter your Facility Details</span>
                            </div>

                        </Grid>
                        <Grid sx={{width: '205px', marginBottom: '2.625rem',}} item >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_5.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Receive Baseline Energy Model</span>
                            </div>

                        </Grid>
                        <Grid sx={{width: '205px', marginBottom: '2.625rem',}} item >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_6.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Start energy savings</span>
                            </div>

                        </Grid>
                        <Grid sx={{width: '205px', marginBottom: '2.625rem',}} item >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_6.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Earn incentives from IESO</span>
                            </div>

                        </Grid>
                    </Grid>
                </Container>
            </Box>

        </React.Fragment>
    )
}

export default HowItWorks