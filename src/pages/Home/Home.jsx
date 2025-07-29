import React from 'react';
import Hero from './Hero';
import Category from './Category';
import CallToAction from './CallToAction';
import AboutUs from './AboutUs';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';
import DynamicTitle from '../../components/DynamicTitle';


const Home = () => {

    
    return (
        <div className="my-5">
            <DynamicTitle title="Home - Find Your Perfect Pet Companion" />
            <Hero></Hero>
            <Category></Category>
            <CallToAction></CallToAction>
            <Testimonials></Testimonials>
            <HowItWorks></HowItWorks>
            <AboutUs></AboutUs>
        </div>
    );
};

export default Home;