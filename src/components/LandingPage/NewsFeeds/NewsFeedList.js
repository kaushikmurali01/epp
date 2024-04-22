import React, { useRef, useState } from 'react';
import { Typography, Box, Container, Grid, Link } from '@mui/material';

import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import BlogPost from './BlogPost';

const NewsFeedList = () => {

    const blogPostList = [
        {
            "image": "/images/newsFeeds/newsFeed_1.jpeg",
            "id": 1,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum is a place holder text"
        },
        {
            "image": "/images/newsFeeds/newsFeed_2.jpeg",
            "id": 2,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum is a place holder text"
        },
        {
            "image": "/images/newsFeeds/newsFeed_3.jpeg",
            "id": 3,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum is a place holder text"
        },
        {
            "image": "/images/newsFeeds/newsFeed_1.jpeg",
            "id": 4,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum is a place holder text"
        },
        {
            "image": "/images/newsFeeds/newsFeed_2.jpeg",
            "id": 5,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum is a place holder text"
        },
        {
            "image": "/images/newsFeeds/newsFeed_3.jpeg",
            "id": 6,
            'link': "#",
            "title": "Lorem ipsum is a place holder text",
            "body": "Lorem ipsum is a place holder text"
        },
    ]
    const settings = {
        draggable: true,
        hasArrows: true,
        slidesToShow: 3.5,
        slidesToScroll: 1,
        itemWidth: 343,
        exactWidth: 343,
    };
    return (
        <Box component={'section'} className='news-feeds-section common-section'>
            <Container maxWidth="lg">
                <Grid container className='heading-row'>
                    <Grid item >
                        <Typography variant="h3" >
                            News Feeds
                        </Typography>

                    </Grid>

                </Grid>
            </Container>
            <Glider
                {...settings}
            >
                {blogPostList && blogPostList.map((post) => {
                    return (
                        <BlogPost key={post.id} post={post} />
                    )
                })}
            </Glider>
        </Box>
    )
}

export default NewsFeedList