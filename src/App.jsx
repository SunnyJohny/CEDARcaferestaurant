import React from "react";
import "./App.css";
import AboutUs from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import foodData from "./data/foodData"; // ✅ Changed from equipmentData
import Dishes from "./components/FoodDisplay"; // ✅ Renamed from EquipmentDisplay
import WhatsAppIcon from "./components/watsappComponent";

function App() {
  return (
    <>
      {/* Search Bar */}
      <SearchBar products={foodData} />

      {/* Main Content */}
      <div className="mt-[80px]">
        <Navbar />
        <Hero />
        <Dishes /> {/* If renamed to FoodDisplay.jsx for consistency */}

        <AboutUs />
        <Contact />
        <WhatsAppIcon />
        <Footer />
      </div>
    </>
  );
}

export default App;
