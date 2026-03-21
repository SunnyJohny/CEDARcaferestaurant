import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-scroll";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import foodData from "../data/foodData";

const Hero = () => {
  return (
    <div className="banner cs-style1 relative" id="home">
      {/* Image Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1500}
        loop={true}
        className="h-96"
      >
        {foodData.map((equipment, index) => (
          <SwiperSlide key={index} className="relative group">
            {/* Image */}
            <img
              src={equipment.image}
              alt={equipment.name}
              className="w-full h-full object-cover"
            />

            {/* Apply Overlay Only on the First Image */}
            {index === 0 && <div className="absolute inset-0 bg-black bg-opacity-50"></div>}

            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
              <h2
                className={`text-4xl font-extrabold mb-6 leading-tight break-words text-center ${index === 0
                  ? "text-white font-Poppins shadow-lg mt-[-10px] lg:hidden"
                  : "text-[#de5c50] font-Moserate, sans-serif"
                  } animate-drop`}
              >
                {index === 0 ? " " : ""}
                {equipment.name}
              </h2>

              {index === 0 && (
                <div className="relative text-center">
                  {/* Welcome Message */}
                  <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                    Welcome to <br />
                    <span className="text-[#FFA500] font-extrabold tracking-wider drop-shadow-md italic funky-font">
                      CEDAR Cafe' Restaurant
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-white max-w-2xl mb-6">
                    Serving you premium <span className="text-yellow-400 font-semibold">food</span> — ready for <span className="text-green-400">eat-in</span>, <span className="text-blue-300">take-away</span>, or <span className="text-pink-300">delivery</span> 🚗
                  </p>

                  <div className="absolute inset-x-0 bottom--16 flex justify-center">
                    <Link
                      to="dishes"
                      spy={true}
                      smooth={true}
                      offset={-70}
                      duration={500}
                    >
                      <button className="px-6 py-2 border-2 border-green-400 text-green-400 bg-transparent rounded-full hover:bg-green-400 hover:text-white hover:scale-105 transition-transform duration-300 shadow-md">
                        Order Now
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {index !== 0 && (
                <Link
                  to="dishes"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  <button className="px-6 py-2 border-2 border-green-400 text-green-400 bg-transparent rounded-full hover:bg-green-400 hover:text-white hover:scale-105 transition-transform duration-300 shadow-md">
                    Order Now
                  </button>
                </Link>
              )}
            </div>
          </SwiperSlide>

        ))}
      </Swiper>


      {/* Bottom Section */}
      <div className="bg-blue-950 text-white py-10 px-6 md:px-24">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center md:text-left">
          Tasty Meals. Love Every Bite. 🍽️
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="text-lg md:w-2/3">
            At <span className="text-orange-500 font-semibold">CEDAR cafe & restaurant</span>, we bring authentic Nigerian and continental <span className="text-yellow-400">food</span> to your table — whether you're dining <span className="underline">in</span>, picking up a quick <span className="underline">take-away</span>, or enjoying the convenience of <span className="underline">delivery</span>.
          </p>
          <Link
            to="dishes"
            spy={true}
            smooth={true}
            offset={-70} // adjust if your header overlaps
            duration={500}
            className="inline-flex items-center gap-2 text-orange-400 hover:text-white font-medium cursor-pointer"
          >
            <span>Start Your Order</span>
            <BsArrowRight />
          </Link>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <Link
        to="dishes"
        spy={true}
        smooth={true}
        className="cs-down_btn md:mt-20 mt-8"
      >
        .
      </Link>
    </div>
  );
};

export default Hero;