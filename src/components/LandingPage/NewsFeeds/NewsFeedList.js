import React from 'react';
import { Typography, Box, Container, Grid } from '@mui/material';

import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import BlogPost from './BlogPost';
import useMediaQueries from 'utils/mediaQueries/mediaQueries';

const NewsFeedList = () => {
    const { theme_Md, theme_Sm } = useMediaQueries();
    const blogPostList = [
        {
            "image": "/images/newsFeeds/newsFeed_1.jpeg",
            "id": 1,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum dolor sit amet consectetur. Dictumst elementum."
        },
        {
            "image": "/images/newsFeeds/newsFeed_2.jpeg",
            "id": 2,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum dolor sit amet consectetur. Dictumst elementum."
        },
        {
            "image": "/images/newsFeeds/newsFeed_3.jpeg",
            "id": 3,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum dolor sit amet consectetur. Dictumst elementum."
        },
        // {
        //     "image": "/images/newsFeeds/newsFeed_1.jpeg",
        //     "id": 4,
        //     'link': "#",
        //     "title": "Lorem ipsum is a place holder text",
        //     "body": "Lorem ipsum dolor sit amet consectetur. Dictumst elementum."
        // },
        // {
        //     "image": "/images/newsFeeds/newsFeed_2.jpeg",
        //     "id": 5,
        //     'link': "#",
        //     "title": "Lorem ipsum is a place holder text",
        //     "body": "Lorem ipsum dolor sit amet consectetur. Dictumst elementum."
        // },
        // {
        //     "image": "/images/newsFeeds/newsFeed_3.jpeg",
        //     "id": 6,
        //     'link': "#",
        //     "title": "Lorem ipsum is a place holder text",
        //     "body": "Lorem ipsum dolor sit amet consectetur. Dictumst elementum."
        // },
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
        <Box component={'section'} className='news-feeds-section  common-section'>
            <Container maxWidth="lg">
                <Grid container className='heading-row' sx={{justifyContent: theme_Sm ? 'flex-start' : 'center'}}>
                    <Grid item >
                        <Typography variant="h3" >
                          What’s New
                        </Typography>

                    </Grid>

                </Grid>
                <Grid className='theme-slider-container'>
                    {blogPostList && blogPostList.length > 3 ?
                        <Glider
                            {...settings}
                        >
                            {blogPostList && blogPostList.map((post) => {
                                return (
                                    <BlogPost key={post.id} post={post} />
                                )
                            })}
                        </Glider>
                        :
                        <Grid container spacing={theme_Md ? 9 : 3} className='news-feed-list'>
                            {
                                blogPostList && blogPostList.map((post) => {
                                    return (
                                        <Grid item key={post.id} xs={12} sm={4}>
                                            <BlogPost post={post} />
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

export default NewsFeedList