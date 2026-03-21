import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaUtensils,
  FaCalendarAlt,
  FaPizzaSlice,
  FaShoppingBasket,
} from "react-icons/fa";
import aboutImage from "../assets/img1.jpg";

const servicesData = [
  {
    icon: FaTruck,
    title: "Fast Delivery",
    description:
      "Enjoy prompt and reliable food delivery that brings your favorite meals straight to your doorstep.",
  },
  {
    icon: FaCalendarAlt,
    title: "Event Catering",
    description:
      "We cater for birthdays, weddings, meetings, and special occasions with delicious meals and quality service.",
  },
  {
    icon: FaUtensils,
    title: "Eat-In",
    description:
      "Relax and enjoy freshly prepared meals in a welcoming and comfortable dine-in environment.",
  },
  {
    icon: FaPizzaSlice,
    title: "Takeaway",
    description:
      "Pick up your meals hot and fresh whenever you need something delicious on the go.",
  },
  {
    icon: FaShoppingBasket,
    title: "Table Reservation",
    description:
      "Reserve a table with ease and enjoy a smooth dining experience with family, friends, or guests.",
  },
];

const iconAnimations = [
  {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { repeat: Infinity, duration: 2 },
    },
  },
  {
    animate: {
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 1.5 },
    },
  },
  {
    animate: {
      scale: [1, 1.2, 1],
      transition: { repeat: Infinity, duration: 1.8 },
    },
  },
  {
    animate: {
      rotate: [0, 10, -10, 10, -10, 0],
      transition: { repeat: Infinity, duration: 2.5 },
    },
  },
  {
    animate: {
      opacity: [0.8, 1, 0.8],
      y: [0, -5, 0],
      transition: { repeat: Infinity, duration: 2.2 },
    },
  },
];

const AboutUs = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="about"
      className="min-h-screen bg-blue-50 text-gray-800 py-12 px-5 md:px-20"
    >
      {/* Title Section */}
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-blue-950 mb-4 tracking-tight">
          About Cedar Cafe&apos; Restaurant
        </h2>
        <p className="text-sm text-gray-500">
          Home &gt; <span className="text-blue-900 font-bold">About Us</span>
        </p>
      </div>

      {/* Main Info Section */}
      <div className="grid lg:grid-cols-2 gap-8 items-center mb-14">
        {/* Image */}
        <div className="w-full flex justify-center lg:justify-start">
          {!imageError ? (
            <div className="w-full max-w-[580px] px-2 md:px-4">
              <img
                src={aboutImage}
                alt="About Cedar Cafe Restaurant"
                className="w-full h-[320px] md:h-[450px] rounded-2xl shadow-lg object-cover border border-blue-100"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-full max-w-[580px] px-2 md:px-4">
              <div className="w-full h-[320px] md:h-[450px] rounded-2xl shadow-lg border border-blue-100 bg-white flex items-center justify-center text-center px-6">
                <p className="text-gray-500">
                  About image not found. Make sure <strong>img1.jpg</strong> exists in
                  <strong> src/assets </strong>
                  and the import path is correct.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong className="text-blue-900">Cedar Cafe&apos; Restaurant</strong> is a
            place where great taste, warm hospitality, and memorable dining come
            together. We are committed to serving fresh, satisfying meals in an
            environment that feels welcoming, comfortable, and enjoyable for everyone.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            From everyday meals to special moments with family and friends, we take
            pride in offering delicious food, excellent customer service, and a dining
            experience you can always look forward to. Whether you want to eat in,
            order takeaway, request delivery, or reserve a table, we are always ready
            to serve you with care and quality.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            At Cedar Cafe&apos; Restaurant, we do not just serve food — we create moments
            of comfort, flavor, and satisfaction that keep our customers coming back.
          </p>

          <p className="text-lg text-blue-900 font-semibold italic">
            Fresh taste, warm service, and memorable moments.
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold mb-8 text-blue-950">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;

            return (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition"
              >
                <motion.div
                  className="flex justify-center mb-4"
                  animate={iconAnimations[index % iconAnimations.length].animate}
                >
                  <IconComponent size={40} className="text-blue-900" />
                </motion.div>

                <h3 className="text-xl font-bold mb-2 text-blue-950">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold text-blue-950 text-center uppercase tracking-wide mb-8">
          Our Vision & Mission
        </h3>

        <h4 className="text-2xl font-semibold text-blue-900 mb-4">Vision</h4>
        <p className="text-lg text-gray-700 bg-white p-5 border-l-4 border-blue-900 rounded-xl shadow-md mb-8 leading-relaxed">
          To become one of the most trusted and loved dining destinations in Jos,
          known for delicious meals, excellent service, and a welcoming atmosphere
          that brings people together.
        </p>

        <h4 className="text-2xl font-semibold text-blue-900 mb-4">Mission</h4>
        <p className="text-lg text-gray-700 bg-white p-5 border-l-4 border-blue-900 rounded-xl shadow-md leading-relaxed">
          To consistently serve fresh, quality, and satisfying meals while delivering
          outstanding customer service in a clean, friendly, and relaxing environment.
          We are committed to making every visit enjoyable and every order worth
          repeating.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;