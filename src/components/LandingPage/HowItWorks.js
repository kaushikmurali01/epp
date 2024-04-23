import React from 'react';
import {Typography, Box, Container, Grid } from '@mui/material';

const HowItWorks = () => {
    return (
        <React.Fragment>
            <Box component={'section'} className='instruction-section ' sx={{ bgcolor: 'primary.light' }} >
                <Container maxWidth="lg">

                    <Grid container justifyContent="space-between" className='instruction-row'>
                        <Grid container item xs={12} md={6} lg={3} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/icon_1.svg' alt='icon_1' />
                            </figure>
                            <div className='text'>
                                <span>Save big on <br /> electricity bills</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={3} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/icon_2.svg' alt='icon_1' />
                            </figure>
                            <div className='text'>
                                <span>Financial incentives <br /> and rebates from IESO</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={3} gap={2} alignItems="center">
                            <figure>
                                <img src='/images/landingpage/icons/icon_3.svg' alt='icon_1' />
                            </figure>
                            <div className='text'>
                                <span>Recognition for your <br /> sustainability efforts</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={3} gap={2} alignItems="center">
                            <figure>
                                <img src='/images/landingpage/icons/icon_4.svg' alt='icon_1' />
                            </figure>
                            <div className='text'>
                                <span>Access to technical <br /> support and resources</span>
                            </div>

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
                    <Grid container className='how-it-work-row'>
                        <Grid container item xs={12} md={6} lg={4} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_1.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Create an account and add your team</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={4} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_2.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Acknowledge Participant Agreement</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={4} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_3.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Enter your Facility Details</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={4} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_5.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Receive Baseline Energy Model</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={4} gap={2} alignItems="center" >
                            <figure>
                                <img src='/images/landingpage/icons/howItWorks/image_6.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <span>Start energy savings</span>
                            </div>

                        </Grid>
                        <Grid container item xs={12} md={6} lg={4} gap={2} alignItems="center" >
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