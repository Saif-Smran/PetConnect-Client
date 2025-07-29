import React from 'react';
import { HiHeart, HiSparkles, HiShieldCheck } from 'react-icons/hi';
import { MdPets, MdVerified, MdFavorite, MdHome, MdSearch, MdConnectWithoutContact } from 'react-icons/md';
import DynamicTitle from '../components/DynamicTitle';

const About = () => {
    const values = [
        {
            icon: <HiShieldCheck className="w-12 h-12 text-primary" />,
            title: "Trust",
            description: "We verify every pet and owner to ensure safe, reliable connections."
        },
        {
            icon: <HiHeart className="w-12 h-12 text-secondary" />,
            title: "Compassion",
            description: "Every interaction is driven by love and care for animals."
        },
        {
            icon: <HiSparkles className="w-12 h-12 text-accent" />,
            title: "Excellence",
            description: "We strive for the best experience for pets and families."
        }
    ];

    const steps = [
        {
            icon: <MdSearch className="w-12 h-12 text-primary" />,
            title: "Browse",
            description: "Discover hundreds of pets waiting for a loving home. Filter by type, breed, or location."
        },
        {
            icon: <MdConnectWithoutContact className="w-12 h-12 text-secondary" />,
            title: "Connect",
            description: "Contact verified shelters or owners directly through our secure platform."
        },
        {
            icon: <MdHome className="w-12 h-12 text-accent" />,
            title: "Adopt",
            description: "Bring home your new family member with confidence and joy. It's that simple."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/20 to-base-100 relative overflow-hidden">
            <DynamicTitle title="About Us - Our Mission & Values" />
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3"></div>
            
            <div className="max-w-11/12 mx-auto px-6 py-16 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
                        <MdPets className="w-5 h-5" />
                        <span>About PetConnect</span>
                    </div>
                    <h1 className="font-secondary font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                        Connecting Hearts & Paws
                    </h1>
                    <p className="font-primary text-xl md:text-2xl text-base-content/70 max-w-4xl mx-auto leading-relaxed">
                        Since 2025, we've been dedicated to creating meaningful connections between pets in need and families ready to love them unconditionally.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/20 rounded-xl">
                                <MdFavorite className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="font-secondary font-bold text-3xl md:text-4xl text-base-content">
                                Our Mission
                            </h2>
                        </div>
                        <p className="font-primary text-lg md:text-xl leading-relaxed text-base-content/80">
                            At PetConnect, we believe every pet deserves a loving home and every family deserves 
                            the joy of a furry companion. We're dedicated to creating meaningful connections 
                            between pets and people through our trusted platform.
                        </p>
                    </div>
                    
                    <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-secondary/20 rounded-xl">
                                <HiSparkles className="w-8 h-8 text-secondary" />
                            </div>
                            <h2 className="font-secondary font-bold text-3xl md:text-4xl text-base-content">
                                Our Vision
                            </h2>
                        </div>
                        <p className="font-primary text-lg md:text-xl leading-relaxed text-base-content/80">
                            We envision a world where no pet goes without love and care. Through technology 
                            and compassion, we're building bridges between animals in need and families 
                            ready to welcome them home.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Our Values
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="group backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-base-100/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        {value.icon}
                                    </div>
                                </div>
                                <h3 className="font-secondary font-bold text-2xl mb-4 text-base-content">{value.title}</h3>
                                <p className="font-primary text-base-content/80 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                            How It Works
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Your journey to finding the perfect companion
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="group backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative">
                                {/* Step number */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {index + 1}
                                </div>
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-base-100/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        {step.icon}
                                    </div>
                                </div>
                                <h3 className="font-secondary font-bold text-2xl mb-4 text-base-content">{step.title}</h3>
                                <p className="font-primary text-base-content/80 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Impact */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="font-secondary font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                            Our Impact
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            The difference we've made together
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                            <div className="text-5xl md:text-6xl font-bold text-primary mb-4">500+</div>
                            <p className="font-primary text-lg text-base-content/80">Pets successfully adopted</p>
                        </div>
                        <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                            <div className="text-5xl md:text-6xl font-bold text-secondary mb-4">50+</div>
                            <p className="font-primary text-lg text-base-content/80">Trusted partner shelters</p>
                        </div>
                        <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                            <div className="text-5xl md:text-6xl font-bold text-accent mb-4">1000+</div>
                            <p className="font-primary text-lg text-base-content/80">Happy families connected</p>
                        </div>
                    </div>
                    <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl">
                        <p className="font-primary text-lg md:text-xl text-base-content/80 max-w-4xl mx-auto leading-relaxed italic">
                            "Every adoption story is a life saved and a family made whole. Thank you for helping us make a difference in the lives of countless pets and families."
                        </p>
                    </div>
                </div>

                {/* Team */}
                <div className="backdrop-blur-lg bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-base-content/10 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-base-100/50 rounded-2xl">
                            <HiHeart className="w-16 h-16 text-red-400" />
                        </div>
                    </div>
                    <h2 className="font-secondary font-bold text-4xl md:text-5xl mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Made with Love by Pet Lovers
                    </h2>
                    <p className="font-primary text-lg md:text-xl text-base-content/80 max-w-4xl mx-auto leading-relaxed">
                        Our team consists of passionate pet lovers, experienced developers, and caring individuals 
                        who understand the special bond between humans and animals. Together, we're working to 
                        create a better world for pets everywhere, one adoption at a time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
