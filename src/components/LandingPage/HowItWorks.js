import React from 'react';
import { Typography, Box, Container, Grid, Stack, Link } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';

const HowItWorks = () => {
    const { getTheme, isMd,isSm } = useMediaQueries();

    const instructionSection = {
        padding: '2rem 0',
        bgcolor: 'primary.light',
        [getTheme.breakpoints.up('lg')]: {
            padding: '2.125rem',
        },
    }
    const instructionRowStyles = {
        display: 'flex',
        gap: 1,
        width: '48%',
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
        justifyContent: 'center',
        gap: '0%',
        flexDirection: 'column',
        alignItems: 'center',
        [getTheme.breakpoints.up('sm')]: {
            justifyContent: 'space-between',
            gap: '5%',
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        [getTheme.breakpoints.up('md')]: {
            gap: '10%',
        },
    }

    const howItWorksItemStyles = {
        width: '11.875rem', 
            marginBottom: '2.5rem',
        [getTheme.breakpoints.up('sm')]: {
           
        },
        [getTheme.breakpoints.up('md')]: {
            width: '13.125rem', 
             marginBottom: '2.625rem',
        },
    }

    return (
        <React.Fragment>
            <Box component={'section'} className='instruction-section ' sx={{ ...instructionSection }} >
                <Container maxWidth="lg">

                    <Grid container justifyContent="space-between" className='instruction-row' sx={{ rowGap: isMd ? '2rem' : '0'  }}>
                        <Grid sx={{ ...instructionRowStyles }} alignItems="center" >
                            <figure style={{ width: isSm ? '3.125rem' : '4.25rem'  }}>
                                <img src='/images/landingPage/icons/icon_1.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Save on <br /> Energy Bills</Typography>
                            </Stack>

                        </Grid>
                        <Grid sx={{ ...instructionRowStyles }} alignItems="center" >
                            <figure style={{ width: isSm ? '3.125rem' : '4.25rem'  }}>
                                <img src='/images/landingPage/icons/icon_2.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Earn incentives <br /> from the IESO </Typography>
                            </Stack>


                        </Grid>
                        <Grid sx={{ ...instructionRowStyles }} alignItems="center">
                            <figure style={{ width: isSm ? '3.125rem' : '4.25rem'  }}>
                                <img src='/images/landingPage/icons/icon_3.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'>Receive recognition<br /> for your efforts </Typography>
                            </Stack>


                        </Grid>
                        <Grid sx={{ ...instructionRowStyles }} alignItems="center">
                            <figure style={{ width: isSm ? '3.125rem' : '4.25rem'  }}>
                                <img src='/images/landingPage/icons/icon_4.svg' alt='icon_1' />
                            </figure>
                            <Stack className='text'>
                                <Typography variant='span'> Access to technical <br /> support and resources</Typography>
                            </Stack>


                        </Grid>
                    </Grid>

                </Container>
            </Box>

            {/* How it works section  */}
            <Box component={'section'} className='how-it-work-section common-section'>
                <Container maxWidth="lg">
                    <Grid container justifyContent="center" className='heading-row'>
                        <Grid item >
                            <Typography variant="h3" className='ev-theme-heading'>
                                How it works
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container className='how-it-work-row'
                        sx={{ ...howItWorksRowStyles }}
                    >
                        <Grid sx={{ ...howItWorksItemStyles }} item >
                            <figure>
                                <img src='/images/landingPage/icons/howItWorks/image_1.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <Typography  sx={{fontWeight: '600'}}>Create an account, add your team, and sign Participant Agreement</Typography>
                            </div>

                        </Grid>
                        <Grid sx={{ ...howItWorksItemStyles }} item >
                            <figure>
                                <img src='/images/landingPage/icons/howItWorks/image_2.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <Typography  sx={{fontWeight: '600'}}>Add your facility details and receive your baseline energy model</Typography>
                            </div>

                        </Grid>
                        <Grid sx={{ ...howItWorksItemStyles }} item >
                            <figure>
                                <img src='/images/landingPage/icons/howItWorks/image_3.svg' alt='image_1' />
                            </figure>
                            <div className='text'>
                                <Typography  sx={{fontWeight: '600'}}>Start saving energy and earning incentives</Typography>
                            </div>

                        </Grid>

                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Typography variant='small' component='small'>
                                 *You can sign the <Link href="#"  variant='a' sx={{color: 'blue.main', textDecoration: 'none'}}>Participant Agreement </Link> anytime, but it’s mandatory before you enrol your first facility into the program
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

        </React.Fragment>
    )
}

export default HowItWorks