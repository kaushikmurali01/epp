import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import useMediaQueries from '../../utils/mediaQueries/mediaQueries';
import Glider from 'react-glider';
import 'glider-js/glider.min.css';

const OurClient = () => {
    const { getTheme, theme_Md, theme_Sm } = useMediaQueries();
    const ourClientList = [
        {
            "image": "/images/landingPage/ourClient/manila.svg",
            "id": 1,
            'link': "#",
            "title": "manila",
        },
        {
            "image": "/images/landingPage/ourClient/golden_view.svg",
            "id": 2,
            'link': "#",
            "title": "golden_view",
        },
        {
            "image": "/images/landingPage/ourClient/rubicon_point.svg",
            "id": 3,
            'link': "#",
            "title": "rubicon_point",
        },
        {
            "image": "/images/landingPage/ourClient/swig_company.svg",
            "id": 4,
            'link': "#",
            "title": "swig_company",
        },
        {
            "image": "/images/landingPage/ourClient/douglas_emmett.svg",
            "id": 5,
            'link': "#",
            "title": "douglas_emmett",
        },
        {
            "image": "/images/landingPage/ourClient/golden_view.svg",
            "id": 6,
            'link': "#",
            "title": "golden_view",
        },
        {
            "image": "/images/landingPage/ourClient/manila.svg",
            "id": 7,
            'link': "#",
            "title": "manila",
        },
      
        {
            "image": "/images/landingPage/ourClient/rubicon_point.svg",
            "id": 8,
            'link': "#",
            "title": "rubicon_point",
        },

    ]
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

    const settings = {
        draggable: true,
        hasArrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            }]
    };

    return (
        <Box id='ourClientSection' component={'section'} className='our-client-section common-section' sx={{ bgcolor: 'primary_2.main' }}>
            <Container maxWidth="lg" >
                <Grid container className='heading-row' >
                    <Grid item sx={{ paddingLeft: '0' }} >
                        <Typography variant="h3" sx={{ color: "primary.contrastText" }}>
                            Trusted By Businesses Across Ontario
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

            <Grid  className='our-client-row theme-slider-container' >
                    <Glider
                        {...settings}
                    >
                        {ourClientList && ourClientList.map((ourClient) => {
                            return (
                                <Grid item sx={{ ...clientGridBoxStyle }} key={ourClient.id} >
                                    <figure>
                                        <img src={ourClient.image} alt={ourClient.title} />
                                    </figure>


                                </Grid>
                            )
                        })}
                    </Glider>
                </Grid>
        </Box>
    )
}

export default OurClient