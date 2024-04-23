import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, Box, Container, Grid } from '@mui/material';


const NewsFeedList = () => {
    return (
        <Box component={'section'} className='news-feeds-section common-section'>
            <Container maxWidth="lg">
                <Grid >
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia
                            sx={{ height: 190 }}
                            image="/images/newsFeeds/newsFeed_1.jpeg"
                            title="green iguana"
                            alt=""
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Lizards are a widespread group of squamate reptiles, with over 6,000
                                species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Share</Button>
                        </CardActions>
                    </Card>
                   
                </Grid>
            </Container>
        </Box>
    )
}

export default NewsFeedList