import React from 'react';
import ContactUsForm from '../components/LandingPage/ContactUsForm';
import NewsFeedList from '../components/LandingPage/NewsFeeds/NewsFeedList';
import HeroBanner from '../components/LandingPage/HeroBanner';
import HowItWorks from '../components/LandingPage/HowItWorks';
import OurClient from '../components/LandingPage/OurClient';
import StoryList from 'components/LandingPage/SuccessStory/StoryList';


const LandingPage = () => {


    return (
        <main>
            <HeroBanner />
            <HowItWorks />
            {/* <StoryList /> */}
            {/* <OurClient /> */}
            <NewsFeedList />
            <ContactUsForm />

        </main>
    )
}

export default LandingPage