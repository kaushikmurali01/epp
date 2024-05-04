import React, { useEffect, useState } from 'react';
import { Typography, Box, Container, Grid } from '@mui/material';

import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import BlogPost from './BlogPost';
import useMediaQueries from 'utils/mediaQueries/mediaQueries';
import { GET_REQUEST } from 'utils/HTTPRequests';
import { LANDING_PAGE } from 'constants/apiEndPoints';

const NewsFeedList = () => {
    const { theme_Md, theme_Sm } = useMediaQueries();
    const [blogPostList, setBlogPostList] = useState([]);
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

    const getLatestNews = () => {
        const apiURL = LANDING_PAGE.GET_NEWS;
        // const apiURL = 'https://enervauser.azurewebsites.net/api/v1/news'
        GET_REQUEST(apiURL)
            .then((res) => {
                setBlogPostList(res.data?.body?.news)
            }).catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        getLatestNews();

    }, [])


    return (
        <Box component={'section'} className='news-feeds-section  common-section'>
            <Container maxWidth="lg">
                <Grid container className='heading-row' sx={{ justifyContent: theme_Sm ? 'flex-start' : 'center' }}>
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