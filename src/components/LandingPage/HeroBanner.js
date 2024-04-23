import React from 'react';
import { Stack, Button, Typography, Box, Container, Grid } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';


const HeroBanner = () => {
    const { theme_Xs,theme_Md, theme_Lg } = useMediaQueries();

    return (
        <Box component={'section'} className='banner-section'>
            <Container maxWidth="lg">
                <Grid container >
                    <Grid item xs={5} className='banner-info'>
                    
                        <Typography variant="h1" gutterBottom 
                        sx={{ display:'flex', flexDirection:'column',
                            marginBottom: theme_Md ? '2.625rem' : '1.875rem'
                        }}
                        >
                            <span>Save Energy. </span>
                            <span>Reduce Costs. </span>
                            <span>Earn Incentives.</span>
                        </Typography>
                        <Typography variant="span" gutterBottom>Start today, get a free baseline energy model, receive an upfront incentive and annually thereafter.</Typography>
                        <Stack direction="row" sx={{ gap: 3, marginTop: theme_Md ? '3rem' : '2rem' }} className='action-btn'  >
                            <Button variant="contained" color="success">
                                Sign up
                            </Button>
                            <Button variant="outlined" color="secondary">
                                Learn More
                            </Button>
                        </Stack>
                        <Typography variant='span' className='whats-new'>What's New <img src="/images/landingpage/speak_icon.svg" /></Typography>
                    </Grid>

                    <Grid item xs={7}>
                        <span className='banner-bg'></span>
                    </Grid>

                </Grid>
            </Container>

        </Box>
    )
}

export default HeroBanner