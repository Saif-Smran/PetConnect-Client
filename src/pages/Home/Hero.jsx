import React from 'react';
import { Link } from 'react-router-dom';
import { MdPets } from 'react-icons/md';

const Hero = () => {
  return (
    <section
      className="relative max-w-11/12 mx-auto min-h-screen flex items-center justify-center bg-center bg-cover bg-no-repeat bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl"
      style={{
        backgroundImage: "url('/BannerBGImage.jpg')",
      }}
    >
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-base-100/90 via-base-100/50 to-transparent z-10"></div>

      {/* Content with glass-morphism */}
      <div className="relative z-20 max-w-5xl px-6 md:px-8 text-center">
        {/* Glass card container */}
        <div className="backdrop-blur-lg bg-base-100/20 border border-base-content/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-4">
              <MdPets className="w-5 h-5" />
              <span>Pet Adoption Platform</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-secondary bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Adopt. Love. Save Lives.
          </h1>
          
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 font-primary text-base-content/80 leading-relaxed">
            Give a forever home to pets in need. Join us in making a difference one adoption at a time through compassionate care and loving connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/pets"
              className="btn btn-primary btn-lg gap-2 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-r from-primary to-secondary text-white"
            >
              <MdPets className="w-6 h-6" />
              View Available Pets
            </Link>
            
            <Link
              to="/about"
              className="btn btn-outline btn-lg gap-2 transition-all duration-300 hover:scale-105 border-2 border-base-content/20 hover:border-primary text-base-content hover:bg-primary hover:text-white"
            >
              Learn More
            </Link>
          </div>
          
          {/* Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-base-content/70">Pets Adopted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">50+</div>
              <div className="text-base-content/70">Partner Shelters</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">1000+</div>
              <div className="text-base-content/70">Happy Families</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
