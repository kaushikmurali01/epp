import React from 'react';
import { Stack, Button, Typography, Box, Container, Grid } from '@mui/material';


const HeroBanner = () => {
    return (
        <Box component={'section'} className='banner-section'>
            <Container maxWidth="lg">
                <Grid container >
                    <Grid item xs={4} className='banner-info'>
                        <Typography variant="h3" gutterBottom>
                            <span>Save Energy. </span>
                            <span>Reduce Costs. </span>
                            <span>Earn Incentives.</span>
                        </Typography>
                        <Typography variant="span" gutterBottom>Enter your facility information for a free baseline estimate, and earn incentive.</Typography>
                        <Stack direction="row" sx={{ gap: 3 }} className='action-btn'>
                            <Button variant="contained" color="success">
                                SignUp
                            </Button>
                            <Button variant="outlined" color="error">
                                Learn More
                            </Button>
                        </Stack>
                        <span className='whats-new'>What's New <img src="/images/landingpage/speak_icon.svg" /></span>
                    </Grid>

                    <Grid item xs={8}>
                        <span className='banner-bg'></span>
                    </Grid>

                </Grid>
            </Container>

        </Box>
    )
}

export default HeroBanner