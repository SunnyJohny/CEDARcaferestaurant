import React from "react";
import {
  FaYoutube,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";

const socialMediaLinks = [
  { name: "YouTube", icon: <FaYoutube />, url: "#" },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp />,
    url: "https://wa.me/2349165961843?text=Hello%20Cedar%20Cafe%20Restaurant%2C%20I%20would%20like%20to%20make%20an%20inquiry.",
  },
  {
    name: "Facebook",
    icon: <FaFacebook />,
    url: "https://www.facebook.com/share/16hswFzy7r/",
  },
  { name: "LinkedIn", icon: <FaLinkedin />, url: "#" },
  { name: "TikTok", icon: <FaTiktok />, url: "#" },
];

const quickLinks = [
  { link: "Home", path: "home" },
  { link: "About", path: "about" },
  { link: "Services", path: "services" },
  { link: "Dishes", path: "dishes" },
  { link: "Testimonials", path: "testimonials" },
  { link: "Contact", path: "contact" },
];

const handleScrollAdjust = (e, path) => {
  e.preventDefault();
  const target = document.getElementById(path);

  if (target) {
    const offset = 100;
    const elementPosition = target.offsetTop - offset;

    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
};

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold mb-4">Cedar Cafe&apos; Restaurant Jos</h2>
            <p className="text-gray-300 mb-4">Fast Food Restaurant</p>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-white" />
                <a href="tel:+2349165961843" className="hover:text-white transition-colors">
                  0916 596 1843
                </a>
              </div>

              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-white" />
                <span>Email coming soon</span>
              </div>

              <div className="flex items-start gap-3">
                <GoLocation className="mt-1 text-white text-lg" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Abuja+House,+7+Langtang+Street,+opp.+St+Theresa+Catholic+Church,+Jos+930105,+Plateau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Abuja House, 7 Langtang Street, opp. St Theresa Catholic Church,
                  Jos 930105, Plateau
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-3">
              {quickLinks.map(({ link, path }) => (
                <li key={path}>
                  <a
                    href={`#${path}`}
                    onClick={(e) => handleScrollAdjust(e, path)}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h2 className="text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex flex-wrap gap-4">
              {socialMediaLinks.map((social, index) => {
                const isInactive = social.url === "#";

                return (
                  <a
                    key={index}
                    href={isInactive ? undefined : social.url}
                    target={isInactive ? undefined : "_blank"}
                    rel={isInactive ? undefined : "noopener noreferrer"}
                    onClick={(e) => {
                      if (isInactive) e.preventDefault();
                    }}
                    title={isInactive ? `${social.name} coming soon` : social.name}
                    className={`text-xl transition-colors ${
                      isInactive
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-white hover:text-gray-400"
                    }`}
                  >
                    {social.icon}
                  </a>
                );
              })}
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Connect with Cedar Cafe&apos; Restaurant on our social platforms.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-700 pt-5 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Cedar Cafe&apos; Restaurant Jos. All rights
            reserved.
          </p>
          <p className="text-xs italic text-gray-500 mt-2">
            Website developed by J-Cloud | +2348030611606
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;