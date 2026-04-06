import React from "react";
import Title from "./Title";
import CarCard from "./CarCard";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
        />
      </motion.div>

      {/* Empty state */}
      {(!cars || cars.length === 0) && (
        <p className="text-gray-500 mt-10">No cars available.</p>
      )}

      {/* Cars Grid */}
      {cars && cars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
        >
          {cars.slice(0, 6).map((car) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => {
          navigate("/cars");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
      >
        Explore all cars
        <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
