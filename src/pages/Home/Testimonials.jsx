import React from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiStar } from 'react-icons/hi';
import { MdPets } from 'react-icons/md';
import { BiSolidQuoteAltLeft } from 'react-icons/bi';

const testimonialsData = [
  {
    id: 1,
    name: "Sarah & Max",
    pet: "Bella (dog adoption)",
    image: "/testimonial1.jpg",
    text: "Adopting Bella changed our lives! She brings so much joy and love to our home."
  },
  {
    id: 2,
    name: "James & Lily",
    pet: "Luna (cat adoption)",
    image: "/testimonial2.jpg",
    text: "Luna quickly became a part of our family. We couldn't be happier with our little furry friend!"
  },
  {
    id: 3,
    name: "Arif & Family",
    pet: "Charlie (dog rescue adoption)",
    image: "/testimonial3.jpg",
    text: "Charlie is more than a pet — he's family. Thanks to PetConnect, we found our loyal companion."
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
            <HiHeart className="w-5 h-5" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-secondary font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Happy Adopters' Stories
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Real families, real love stories. Discover how PetConnect has brought joy and companionship to homes across the country.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map(({ id, name, pet, image, text }) => (
            <div 
              key={id} 
              className="group backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden"
            >
              {/* Quote decoration */}
              <div className="absolute top-4 right-4 opacity-10">
                <BiSolidQuoteAltLeft className="w-16 h-16 text-primary" />
              </div>
              
              {/* Profile section */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <img
                    src={image}
                    alt={`${name} with ${pet}`}
                    className="w-20 h-20 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300 border-4 border-base-100"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <MdPets className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-xl text-base-content mb-1">{name}</h3>
                <p className="text-primary font-medium text-sm px-3 py-1 bg-primary/20 rounded-full">{pet}</p>
              </div>

              {/* Star rating */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial text */}
              <blockquote className="text-base-content/80 leading-relaxed text-center italic">
                "{text}"
              </blockquote>

              {/* Heart decoration */}
              <div className="flex justify-center mt-6">
                <div className="flex items-center gap-1">
                  <HiHeart className="w-4 h-4 text-red-400" />
                  <HiHeart className="w-3 h-3 text-red-300" />
                  <HiHeart className="w-4 h-4 text-red-400" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold text-base-content mb-4">Ready to Create Your Own Story?</h3>
            <p className="text-base-content/70 mb-6">
              Join thousands of happy families who have found their perfect companion through PetConnect.
            </p>
            <Link
              to="/pets"
              className="btn btn-primary btn-lg gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary border-0 text-white"
            >
              <MdPets className="w-5 h-5" />
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
