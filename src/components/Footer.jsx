import React from 'react';
import { Link } from 'react-router-dom';
import { MdPets, MdVolunteerActivism, MdHome, MdFavorite } from 'react-icons/md';
import { HiMail, HiPhone, HiLocationMarker, HiHeart } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-base-200 to-base-300 text-base-content relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-11/12 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="h-12 w-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MdPets className="w-7 h-7" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  PetConnect
                </span>
                <p className="text-sm text-base-content/70 -mt-1">Find Your Perfect Companion</p>
              </div>
            </Link>
            <p className="text-base-content/80 mb-6 leading-relaxed">
              Connecting hearts with paws. We believe every pet deserves a loving home and every family deserves the joy of a furry companion. Join our mission to create perfect matches between pets and their forever families.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/saif.smran.1" className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-300 group">
                <FaFacebook className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://x.com/Soron_Hosain" className="p-2 bg-secondary/10 hover:bg-secondary/20 rounded-full transition-colors duration-300 group">
                <FaTwitter className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://www.instagram.com/hosain_soron/" className="p-2 bg-accent/10 hover:bg-accent/20 rounded-full transition-colors duration-300 group">
                <FaInstagram className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a href="https://www.linkedin.com/in/a-h-m-saif-smran" className="p-2 bg-info/10 hover:bg-info/20 rounded-full transition-colors duration-300 group">
                <FaLinkedin className="w-5 h-5 text-info group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-base-content flex items-center space-x-2">
              <MdFavorite className="w-5 h-5 text-primary" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="flex items-center space-x-3 text-base-content/70 hover:text-primary transition-colors duration-300 group">
                  <MdHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/pets" className="flex items-center space-x-3 text-base-content/70 hover:text-primary transition-colors duration-300 group">
                  <MdPets className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Pet Listings</span>
                </Link>
              </li>
              <li>
                <Link to="/donations" className="flex items-center space-x-3 text-base-content/70 hover:text-primary transition-colors duration-300 group">
                  <MdVolunteerActivism className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>Donation Campaigns</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center space-x-3 text-base-content/70 hover:text-primary transition-colors duration-300 group">
                  <HiHeart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-base-content flex items-center space-x-2">
              <HiMail className="w-5 h-5 text-secondary" />
              <span>Get in Touch</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-base-content/70 group">
                <div className="p-2 bg-info/10 rounded-lg group-hover:bg-info/20 transition-colors duration-300">
                  <HiMail className="w-4 h-4 text-info" />
                </div>
                <div>
                  <span className="text-sm text-base-content/50">Email</span>
                  <p className="font-medium">smrangb@gmail.com</p>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-base-content/70 group">
                <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors duration-300">
                  <HiPhone className="w-4 h-4 text-success" />
                </div>
                <div>
                  <span className="text-sm text-base-content/50">Phone</span>
                  <p className="font-medium">+88 01521 468295</p>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-base-content/70 group">
                <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors duration-300">
                  <HiLocationMarker className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <span className="text-sm text-base-content/50">Location</span>
                  <p className="font-medium">Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-base-300/50 mt-6 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-base-content/70">
              <HiHeart className="w-4 h-4 text-red-500" />
              <span className="text-sm">
                Made with love for our furry friends
              </span>
            </div>
            <div className="text-sm text-base-content/50">
              &copy; 2025 PetConnect. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-base-content/50">
              <Link to="#" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
