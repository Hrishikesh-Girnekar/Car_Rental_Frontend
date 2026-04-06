import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // Prevent crash if car is undefined
  if (!car) return null;

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car?.image || "https://via.placeholder.com/300"}
          alt={`${car?.brand} ${car?.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Availability */}
        {car?.isAvailable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        {/* Price */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {car?.pricePerDay || 0}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">
              {car?.brand} {car?.model}
            </h3>
            <p className="text-muted-foreground text-sm">
              {car?.category} • {car?.year}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600">
          <div className="flex items-center text-sm">
            <img src={assets.users_icon} alt="" className="h-4 mr-2" />
            <span>{car?.seating_capacity || 0} Seats</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.fuel_icon} alt="" className="h-4 mr-2" />
            <span>{car?.fuel_type || "N/A"}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.car_icon} alt="" className="h-4 mr-2" />
            <span>{car?.transmission || "N/A"}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.location_icon} alt="" className="h-4 mr-2" />
            <span>{car?.location || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
