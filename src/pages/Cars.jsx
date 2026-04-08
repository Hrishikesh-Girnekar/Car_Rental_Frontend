import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import Loader from "../components/Loader";

const Cars = () => {
  const [searchParams] = useSearchParams();

  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, api } = useAppContext();

  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSearchData = pickupLocation && pickupDate && returnDate;

  //   Filter function
  const applyFilter = () => {
    if (!cars || cars.length === 0) {
      setFilteredCars([]);
      return;
    }

    if (input.trim() === "") {
      setFilteredCars(cars);
      return;
    }

    const filtered = cars.filter((car) => {
      return (
        car?.brand?.toLowerCase().includes(input.toLowerCase()) ||
        car?.model?.toLowerCase().includes(input.toLowerCase()) ||
        car?.category?.toLowerCase().includes(input.toLowerCase()) ||
        car?.transmission?.toLowerCase().includes(input.toLowerCase())
      );
    });

    setFilteredCars(filtered);
  };

  //   Search availability API
  const searchCarAvailability = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/api/booking/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setFilteredCars(data.availableCars);

        if (data.availableCars.length === 0) {
          toast("No cars available");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch available cars",
      );
    } finally {
      setLoading(false);
    }
  };

  //   Handle search params change
  useEffect(() => {
  if (!isSearchData) {
    if (cars && cars.length > 0) {
      setFilteredCars(cars);
      setLoading(false); // ✅ stop loader only when cars arrive
    } else {
      setLoading(true); // ✅ keep loader until cars come
    }
  }
}, [cars]);

  //   Handle local filtering
  useEffect(() => {
    if (!isSearchData) {
      applyFilter();
    }
  }, [input, cars]);

  return (
    <div>
      {/* Top Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
      >
        <Title
          title="Available Cars"
          subTitle="Browse our selection of premium vehicles available for your next adventure"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow"
        >
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />

          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </motion.div>
      </motion.div>

      {/* Cars Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
      >
        {/* Loader */}
        {loading ? (
          <Loader text="Fetching cars..." />
        ) : filteredCars.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No cars found.</p>
        ) : (
          <>
            <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
              Showing {filteredCars.length} Cars
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
              {filteredCars.map((car) => (
                <motion.div
                  key={car._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Cars;
