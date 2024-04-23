import { Box, Grid, Paper } from '@mui/material';
import React from 'react';
import ContactUsForm from '../components/LandingPage/ContactUsForm';
import NewsFeedList from '../components/LandingPage/NewsFeeds/NewsFeedList';
import HeroBanner from '../components/LandingPage/HeroBanner';
import HowItWorks from '../components/LandingPage/HowItWorks';
import Testimonial from '../components/LandingPage/Testimonial';
import OurClient from '../components/LandingPage/OurClient';


const LandingPage = () => {


    return (
        <main className='main-contianer'>
            <HeroBanner />
            <HowItWorks />
            <Testimonial />
            <OurClient />
            <NewsFeedList />
            <ContactUsForm />

        </main>
    )
}

export default LandingPage