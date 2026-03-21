import { useRef } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaTiktok,
  FaWhatsapp,
  FaFacebook,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        "template_2hgv8sp",
        form.current,
        "6UfHuLSCvF132R-1l"
      )
      .then(
        () => {
          toast.success("Message sent successfully");
          e.target.reset();
        },
        (error) => toast.error(error.text)
      );
  };

  return (
    <section id="contact" className="py-12 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Contact Us
          </h2>
          <p className="text-sm text-gray-500">
            Home &gt; <span className="text-blue-900 font-bold">Contact Us</span>
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-8 items-stretch">
          {/* Form Section */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="w-full lg:w-1/2 max-w-md p-6 border border-blue-100 bg-white shadow-lg rounded-xl"
          >
            <h3 className="text-2xl font-bold text-blue-950 mb-6">
              Send Us a Message
            </h3>

            <label className="block text-lg font-medium mb-2 text-gray-800">
              Name
            </label>
            <input
              type="text"
              name="user_name"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Full Name"
              required
            />

            <label className="block text-lg font-medium mb-2 text-gray-800">
              Email
            </label>
            <input
              type="email"
              name="user_email"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Your active email"
              required
            />

            <label className="block text-lg font-medium mb-2 text-gray-800">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Subject"
              required
            />

            <label className="block text-lg font-medium mb-2 text-gray-800">
              Message
            </label>
            <textarea
              name="message"
              rows="5"
              className="block w-full text-base p-3 border border-gray-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Write your message here..."
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white text-lg font-medium py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Details Section */}
          <div className="w-full lg:w-1/2 bg-blue-950 text-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Cedar Cafe&apos; Restaurant Jos
            </h3>
            <p className="mb-2 text-blue-100 font-medium text-lg">
              Fast Food Restaurant
            </p>
            <p className="mb-8 text-blue-100 leading-relaxed">
              Fill the form or reach out through any of the contact channels below.
              We are always ready to attend to your inquiries and orders.
            </p>

            <div className="space-y-5">
              <div className="flex items-center">
                <FaPhoneAlt className="text-blue-200 text-2xl mr-4" />
                <a
                  href="tel:+2349165961843"
                  className="hover:underline text-white"
                >
                  0916 596 1843
                </a>
              </div>

              <div className="flex items-center">
                <FaEnvelope className="text-blue-200 text-2xl mr-4" />
                <p>Email not available yet</p>
              </div>

              <div className="flex items-start">
                <GoLocation className="text-blue-200 text-2xl mr-4 mt-1" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Abuja+House,+7+Langtang+Street,+opp.+St+Theresa+Catholic+Church,+Jos+930105,+Plateau"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline leading-relaxed"
                >
                  Abuja House, 7 Langtang Street, opp. St Theresa Catholic Church,
                  Jos 930105, Plateau
                </a>
              </div>

              <div className="flex items-center">
                <FaFacebook className="text-blue-200 text-2xl mr-4" />
                <p>Facebook page link coming soon</p>
              </div>

              <div className="flex items-center">
                <FaTiktok className="text-blue-200 text-2xl mr-4" />
                <p>TikTok handle not available yet</p>
              </div>

              <div className="flex items-center">
                <FaWhatsapp className="text-blue-200 text-2xl mr-4" />
                <a
                  href="https://wa.me/2349165961843?text=Hello%20Cedar%20Cafe%20Restaurant%2C%20I%20would%20like%20to%20make%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-white"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;