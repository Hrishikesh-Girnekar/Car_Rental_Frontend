import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddCar = () => {
  const { api, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialCarState = {
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  };

  const [car, setCar] = useState(initialCarState);

  // Handle Submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    // Validation
    if (!image) {
      return toast.error("Please upload a car image");
    }

    if (car.year < 1900 || car.year > new Date().getFullYear()) {
      return toast.error("Enter a valid year");
    }

    if (car.pricePerDay <= 0) {
      return toast.error("Price must be greater than 0");
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      // Convert numeric fields
      const formattedCar = {
        ...car,
        year: Number(car.year),
        pricePerDay: Number(car.pricePerDay),
        seating_capacity: Number(car.seating_capacity),
      };

      formData.append("carData", JSON.stringify(formattedCar));

      const { data } = await api.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);

        // Reset form
        setImage(null);
        setCar(initialCarState);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add car");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* Image Upload */}
        <div className="flex items-center gap-2 w-full">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="upload"
              className="h-14 rounded cursor-pointer"
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="text-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Brand (BMW, Audi...)"
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
          />

          <input
            type="text"
            placeholder="Model (X5, E-Class...)"
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          />
        </div>

        {/* Year, Price, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <input
            type="number"
            placeholder="Year"
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
          />

          <input
            type="number"
            placeholder={`Price (${currency})`}
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
            value={car.pricePerDay}
            onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
          />

          <select
            value={car.category}
            onChange={(e) => setCar({ ...car, category: e.target.value })}
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
          >
            <option value="">Category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
          </select>
        </div>

        {/* Transmission, Fuel, Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <select
            value={car.transmission}
            onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
          >
            <option value="">Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>

          <select
            value={car.fuel_type}
            onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
          >
            <option value="">Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>

          <input
            type="number"
            placeholder="Seats"
            required
            className="px-3 py-2 border border-borderColor rounded-md outline-none"
            value={car.seating_capacity}
            onChange={(e) =>
              setCar({ ...car, seating_capacity: e.target.value })
            }
          />
        </div>

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          required
          className="px-3 py-2 border border-borderColor rounded-md outline-none"
          value={car.location}
          onChange={(e) => setCar({ ...car, location: e.target.value })}
        />

        {/* Description */}
        <textarea
          rows={4}
          placeholder="Car description..."
          required
          className="px-3 py-2 border border-borderColor rounded-md outline-none"
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
        />

        {/* Button */}
        <button
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer disabled:opacity-50"
        >
          <img src={assets.tick_icon} alt="" />
          {isLoading ? "Listing..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
