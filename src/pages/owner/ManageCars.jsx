import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCars = () => {
  const { isOwner, api, currency } = useAppContext();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  //   Fetch Cars
  const fetchOwnerCars = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/owner/cars");

      if (res.data.success) {
        setCars(res.data.cars);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  //   Toggle Availability (Optimistic)
  const toggleAvailability = async (carId) => {
    try {
      const res = await api.post("/api/owner/toggle-car", { carId });

      if (res.data.success) {
        toast.success(res.data.message);

        // Optimistic update
        setCars((prev) =>
          prev.map((c) =>
            c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c,
          ),
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  //   Delete Car (Optimistic)
  const deleteCar = async (carId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?",
    );

    if (!confirmDelete) return;

    try {
      const res = await api.post("/api/owner/delete-car", { carId });

      if (res.data.success) {
        toast.success(res.data.message);

        //  Optimistic removal
        setCars((prev) => prev.filter((c) => c._id !== carId));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete car");
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchOwnerCars();
    } else {
      setLoading(false);
    }
  }, [isOwner]);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Cars"
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />

      {/*   Loading */}
      {loading && <p className="text-gray-500 mt-6">Loading cars...</p>}

      {/*   Empty state */}
      {!loading && cars.length === 0 && (
        <p className="text-gray-500 mt-6">No cars found.</p>
      )}

      {/*   Table */}
      {!loading && cars.length > 0 && (
        <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium max-md:hidden">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr
                  key={car._id} 
                  className="border-t border-borderColor"
                >
                  {/* Car */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={car?.image}
                      alt="car"
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium">
                        {car?.brand} {car?.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {car?.seating_capacity} • {car?.transmission}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3 max-md:hidden">{car?.category}</td>

                  {/* Price */}
                  <td className="p-3">
                    {currency}
                    {car?.pricePerDay}/day
                  </td>

                  {/* Status */}
                  <td className="p-3 max-md:hidden">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        car?.isAvailable
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {car?.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="flex items-center p-3 gap-3">
                    <img
                      onClick={() => toggleAvailability(car._id)}
                      src={
                        car?.isAvailable
                          ? assets.eye_close_icon
                          : assets.eye_icon
                      }
                      alt=""
                      className="cursor-pointer"
                    />

                    <img
                      onClick={() => deleteCar(car._id)}
                      src={assets.delete_icon}
                      alt=""
                      className="cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
