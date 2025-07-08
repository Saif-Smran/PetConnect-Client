import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-secondary font-bold text-5xl mb-4">
                        ℹ️ About PetConnect
                    </h1>
                    <p className="font-primary text-xl opacity-80 max-w-2xl mx-auto">
                        Connecting hearts and paws since 2025. Learn about our mission to create loving bonds between pets and families.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="card-pet p-8">
                        <h2 className="font-secondary font-semibold text-3xl mb-6 text-primary">
                            Our Mission
                        </h2>
                        <p className="font-primary text-lg leading-relaxed opacity-90">
                            At PetConnect, we believe every pet deserves a loving home and every family deserves 
                            the joy of a furry companion. We're dedicated to creating meaningful connections 
                            between pets and people through our trusted platform.
                        </p>
                    </div>
                    
                    <div className="card-pet p-8">
                        <h2 className="font-secondary font-semibold text-3xl mb-6 text-secondary">
                            Our Vision
                        </h2>
                        <p className="font-primary text-lg leading-relaxed opacity-90">
                            We envision a world where no pet goes without love and care. Through technology 
                            and compassion, we're building bridges between animals in need and families 
                            ready to welcome them home.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h2 className="font-secondary font-bold text-4xl text-center mb-12">
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card-pet p-6 text-center hover-lift">
                            <div className="text-5xl mb-4">🤝</div>
                            <h3 className="font-secondary font-semibold text-xl mb-3">Trust</h3>
                            <p className="font-primary opacity-80">
                                We verify every pet and owner to ensure safe, reliable connections.
                            </p>
                        </div>
                        
                        <div className="card-pet p-6 text-center hover-lift">
                            <div className="text-5xl mb-4">💖</div>
                            <h3 className="font-secondary font-semibold text-xl mb-3">Compassion</h3>
                            <p className="font-primary opacity-80">
                                Every interaction is driven by love and care for animals.
                            </p>
                        </div>
                        
                        <div className="card-pet p-6 text-center hover-lift">
                            <div className="text-5xl mb-4">🌟</div>
                            <h3 className="font-secondary font-semibold text-xl mb-3">Excellence</h3>
                            <p className="font-primary opacity-80">
                                We strive for the best experience for pets and families.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="card-pet p-12 text-center">
                    <h2 className="font-secondary font-bold text-4xl mb-8">
                        Made with ❤️ by Pet Lovers
                    </h2>
                    <p className="font-primary text-lg opacity-80 max-w-3xl mx-auto">
                        Our team consists of passionate pet lovers, experienced developers, and caring individuals 
                        who understand the special bond between humans and animals. Together, we're working to 
                        create a better world for pets everywhere.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
