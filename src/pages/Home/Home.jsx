import React from 'react';
import Hero from './Hero';
import Category from './Category';
import CallToAction from './CallToAction';
import AboutUs from './AboutUs';
import Testimonials from './Testimonials';
import HowItWorks from './HowItWorks';


const Home = () => {

    
    return (
        <div className="my-5">
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