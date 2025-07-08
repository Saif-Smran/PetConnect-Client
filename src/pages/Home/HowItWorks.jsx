import React from 'react';
import { Link } from 'react-router-dom';
import { MdPets, MdFavorite, MdHome, MdSearch, MdConnectWithoutContact } from 'react-icons/md';
import { HiSparkles, HiArrowRight } from 'react-icons/hi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <MdSearch className="w-12 h-12 text-white" />,
      title: 'Browse Pets',
      description: 'Explore our extensive listings of adorable pets from verified shelters, each with detailed profiles and stories.',
      color: 'from-primary to-primary/70'
    },
    {
      icon: <MdConnectWithoutContact className="w-12 h-12 text-white" />,
      title: 'Meet & Match',
      description: 'Connect directly with shelters or foster homes through our secure platform to meet your potential new family member.',
      color: 'from-secondary to-secondary/70'
    },
    {
      icon: <MdHome className="w-12 h-12 text-white" />,
      title: 'Bring Them Home',
      description: 'Complete the adoption process with confidence and welcome your new companion into your loving family!',
      color: 'from-accent to-accent/70'
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/20 to-base-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/3 via-transparent to-accent/3"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary font-medium mb-6">
            <HiSparkles className="w-5 h-5" />
            <span>Simple Process</span>
          </div>
          <h2 className="font-secondary text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent leading-tight">
            How PetConnect Works
          </h2>
          <p className="font-primary text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            We make adoption simple, safe, and caring. Follow these three easy steps to give a pet the loving home they deserve.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group relative backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              {/* Step number */}
              <div className={`absolute -top-1 -left-1 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                {idx + 1}
              </div>

              {/* Connecting line (except for last step) */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <HiArrowRight className="w-8 h-8 text-base-content/30" />
                </div>
              )}

              {/* Icon container */}
              <div className="flex justify-center mb-6">
                <div className={`p-6 bg-gradient-to-r ${step.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="font-secondary font-bold text-2xl mb-4 text-base-content">{step.title}</h3>
              <p className="font-primary text-base-content/80 leading-relaxed">{step.description}</p>

              {/* Decorative elements */}
              <div className="absolute bottom-4 left-4 opacity-10">
                <MdPets className="w-8 h-8 text-base-content" />
              </div>
            </div>
          ))}
        </div>

        {/* Process Timeline (Mobile) */}
        <div className="md:hidden flex justify-center mb-16">
          <div className="flex flex-col items-center space-y-4">
            {steps.map((_, idx) => (
              <React.Fragment key={idx}>
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${steps[idx].color}`}></div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 h-8 bg-base-content/20"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-xl">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-primary to-secondary rounded-2xl">
                <MdFavorite className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-base-content font-secondary">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Thousands of loving pets are waiting for their forever homes. Take the first step today and discover the joy of unconditional love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/pets"
                className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary border-0 text-white"
              >
                <MdPets className="w-6 h-6" />
                Browse Available Pets
              </Link>
              <Link
                to="/about"
                className="btn btn-outline btn-lg gap-3 transition-all duration-300 hover:scale-105 border-2 border-base-content/20 hover:border-secondary hover:bg-secondary hover:text-white"
              >
                <HiSparkles className="w-6 h-6" />
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
