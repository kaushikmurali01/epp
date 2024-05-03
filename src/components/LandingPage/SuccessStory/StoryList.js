import React from 'react';
import { Typography, Box, Container, Grid } from '@mui/material';

import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import Detail from './Detail';
import useMediaQueries from 'utils/mediaQueries/mediaQueries';

const StoryList = () => {
    const { theme_Md, theme_Sm } = useMediaQueries();

    const storyReviewList = [
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 1,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 2,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 3,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 4,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 5,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 6,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
        {
            "image": "/images/landingPage/testimonials/avtar.svg",
            "id": 7,
            'link': "#",
            "title": "Henry Williams",
            "body": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without. Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without."
        },
    ]
    const settings = {
        draggable: true,
        hasArrows: true,
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
        <Box component={'section'} className='success-story-section common-section' sx={{ bgcolor: 'primary.thinLight' }}>
            <Container maxWidth="lg">
                <Grid container className='heading-row' sx={{justifyContent: theme_Sm ? 'flex-start' : 'center', textAlign : theme_Sm ? 'left': 'center'}}>
                    <Grid item >
                        <Typography variant="h3" >
                            See how others are succeeding with EPP
                        </Typography>

                    </Grid>

                </Grid>
                <Grid className='theme-slider-container'>
                    {storyReviewList && storyReviewList.length > 3 ?
                        <Glider
                            {...settings}
                        >
                            {storyReviewList && storyReviewList.map((post) => {
                                return (
                                    <Detail key={post.id} post={post} />
                                )
                            })}
                        </Glider>
                        :
                        <Grid container spacing={theme_Md ? 9 : 3} className='news-feed-list'>
                            {
                                storyReviewList && storyReviewList.map((post) => {
                                    return (
                                        <Grid item key={post.id} xs={12} sm={4}>
                                            <Detail post={post} />
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    }
                </Grid>
            </Container>

        </Box>
    )
}

export default StoryList;