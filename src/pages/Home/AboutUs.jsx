import React from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiArrowRight } from 'react-icons/hi';
import { MdPets, MdVerified, MdFavorite } from 'react-icons/md';

const AboutUs = () => {
  const features = [
    {
      icon: <MdPets className="w-6 h-6 text-primary" />,
      title: "Browse Adoptable Pets",
      description: "Explore pets from verified shelters with detailed profiles"
    },
    {
      icon: <MdVerified className="w-6 h-6 text-secondary" />,
      title: "Trusted Network",
      description: "Connect directly with reputable shelters and rescue organizations"
    },
    {
      icon: <MdFavorite className="w-6 h-6 text-accent" />,
      title: "Easy Application",
      description: "Simple online process to find your perfect companion"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-base-100 via-base-200/20 to-base-100 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-secondary/3"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="space-y-8">
            {/* Section badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium">
              <HiHeart className="w-5 h-5" />
              <span>About PetConnect</span>
            </div>

            {/* Main heading */}
            <h2 className="font-secondary text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Connecting Hearts & Paws
            </h2>

            {/* Description */}
            <p className="font-primary text-xl text-base-content/80 leading-relaxed">
              PetConnect was created to make adoption easy, safe, and compassionate. We work with trusted shelters to help animals find loving homes and create countless happy endings.
            </p>

            {/* Features grid */}
            <div className="grid gap-6 md:grid-cols-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-base-100/50 border border-base-content/10 hover:shadow-lg transition-all duration-300">
                  <div className="flex-shrink-0 p-3 bg-base-100 rounded-xl shadow-md">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content mb-2 text-lg">{feature.title}</h3>
                    <p className="text-base-content/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mission statement */}
            <div className="backdrop-blur-sm bg-base-100/30 border border-base-content/10 rounded-2xl p-6">
              <p className="font-primary text-base-content/80 italic leading-relaxed">
                "We believe no pet should go unloved or unwanted. By making adoption simpler, we hope to save lives and create more happy families."
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about"
                className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary border-0 text-white"
              >
                <HiArrowRight className="w-5 h-5" />
                Learn More About Us
              </Link>
              <Link
                to="/pets"
                className="btn btn-outline btn-lg gap-3 transition-all duration-300 hover:scale-105 border-2 border-base-content/20 hover:border-primary hover:bg-primary hover:text-white"
              >
                <MdPets className="w-5 h-5" />
                Browse Pets
              </Link>
            </div>
          </div>

          {/* Image section */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="/BannerBGImage.jpg"
                alt="About PetConnect"
                className="w-full h-96 md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-secondary/40"></div>
              
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 backdrop-blur-lg bg-base-100/20 border border-base-content/20 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <HiHeart className="w-8 h-8 text-red-400" />
                  <div>
                    <h3 className="font-bold text-lg">500+</h3>
                    <p className="text-sm opacity-90">Successful Adoptions</p>
                  </div>
                </div>
              </div>

              {/* Top right stats */}
              <div className="absolute top-6 right-6 backdrop-blur-lg bg-base-100/20 border border-base-content/20 rounded-2xl p-4 text-white text-center">
                <div className="flex items-center justify-center mb-2">
                  <MdPets className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold">50+</h3>
                <p className="text-sm opacity-90">Partner Shelters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
