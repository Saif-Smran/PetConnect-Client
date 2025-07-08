import React from 'react';
import { MdPets, MdVolunteerActivism } from 'react-icons/md';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  const callToActionItems = [
    {
      id: 1,
      image: '/HappyAdoptedPuppy.jpg',
      title: 'Happy Adopted Puppy with Family',
      caption: 'Experience the joy of giving a pet a loving home.',
    },
    {
      id: 2,
      image: '/CozyKitten.jpg',
      title: 'Cozy Kitten in New Home',
      caption: 'Create warm memories with your new furry friend.',
    },
    {
      id: 3,
      image: '/PetAdoptionEvent.jpg',
      title: 'Pet Adoption Event',
      caption: 'Join our events and help more pets find their families.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-base-100 via-base-200/30 to-base-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="max-w-11/12 mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-medium mb-6">
            <MdVolunteerActivism className="w-5 h-5" />
            <span>Make a Difference</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-secondary mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Transform Lives Together
          </h2>
          <p className="max-w-3xl mx-auto text-base-content/70 text-xl font-primary leading-relaxed">
            Every adoption creates a ripple of joy. Join our mission to connect loving families with pets in need and create countless happy endings.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {callToActionItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl border border-base-content/10"
            >
              {/* Image */}
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100/95 via-base-100/50 to-transparent"></div>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="backdrop-blur-sm bg-base-100/80 rounded-2xl p-6 border border-base-content/10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-base-content mb-3 font-secondary">
                    {item.title}
                  </h3>
                  <p className="text-base-content/80 mb-4 leading-relaxed">{item.caption}</p>
                  <Link
                    to="/pets"
                    className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary border-0 text-white"
                  >
                    <MdPets className="w-4 h-4" />
                    See Available Pets
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="backdrop-blur-lg bg-base-100/30 border border-base-content/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-base-content font-secondary">
              Ready to Change a Life?
            </h3>
            <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
              Join thousands of compassionate people who have already made a difference. Your perfect companion is waiting for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/pets"
                className="btn btn-primary btn-lg gap-3 shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-secondary border-0 text-white"
              >
                <MdPets className="w-6 h-6" />
                Adopt a Pet Today
              </Link>
              <Link
                to="/register"
                className="btn btn-outline btn-lg gap-3 transition-all duration-300 hover:scale-105 border-2 border-base-content/20 hover:border-accent hover:bg-accent hover:text-white"
              >
                <MdVolunteerActivism className="w-6 h-6" />
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
