import React from 'react';
import {  Typography, Box, Container, Grid, Avatar } from '@mui/material';

const Testimonial = () => {
    return (
        <React.Fragment>


            {/* How it works section  */}
            <Box component={'section'} className='testimonial-section common-section' sx={{ bgcolor: 'primary.light' }}>
                <Container maxWidth="lg">
                    <Grid container justifyContent="space-between" className='heading-row'>
                        <Grid container item xs={12} justifyContent="center" >
                            <Typography variant="h4" className='ev-theme-heading'>
                                See How Others Are Succeeding with EPP
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className='testimonial-section-row'>
                        <Grid item className='image-box'>
                            <div className='active-image'>
                                <Avatar className='large-avatar' src="/images/landingPage/testimonials/testimonial_main.png" alt='' />
                            </div>

                            <ul  className='remaining-list'>
                                <li>
                                    <Avatar alt="Remy Sharp" src="/images/landingPage/testimonials/small_icon_1.png" />
                                </li>
                                <li>
                                    <Avatar alt="Remy Sharp" src="/images/landingPage/testimonials/small_icon_1.png" />
                                </li>
                                <li>
                                    <Avatar alt="Remy Sharp" src="/images/landingPage/testimonials/small_icon_1.png" />
                                </li>
                                <li>
                                    <Avatar alt="Remy Sharp" src="/images/landingPage/testimonials/small_icon_1.png" />
                                </li>
                                <li>
                                    <Avatar alt="Remy Sharp" src="/images/landingPage/testimonials/small_icon_1.png" />
                                </li>
                            </ul>

                        </Grid>

                        <Grid item className='content-box'>
                            <Typography variant="h5" >
                                Amanda Jones
                            </Typography>
                            <Typography variant="span">
                                Lorem ipsum dolor sit amet consectetur. Eros auctor nunc sit proin in tempor.
                                Tempus sollicitudin sed. Lorem ipsum dolor sit amet consectetur.
                                Eros auctor nunc sit proin in tempor. Tempus sollicitudin sed.
                            </Typography>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

        </React.Fragment>
    )
}

export default Testimonial