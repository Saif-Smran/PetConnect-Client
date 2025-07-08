import React from 'react';
import Hero from './Hero';
import Category from './Category';
import CallToAction from './CallToAction';
import AboutUs from './AboutUs';


const Home = () => {

    
    return (
        <div className="max-w-11/12 mx-auto my-5">
            <Hero></Hero>
            <Category></Category>
            <CallToAction></CallToAction>
            <AboutUs></AboutUs>
        </div>
    );
};

export default Home;