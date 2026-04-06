import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageBookings = () => {
  const { currency, api } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/booking/owner");

      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Change status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const res = await api.post("/api/booking/change-status", {
        bookingId,
        status,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        // Optimistic update (better UX)
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status } : b)),
        );
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      {/* Loading */}
      {loading && <p className="text-gray-500 mt-6">Loading bookings...</p>}

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <p className="text-gray-500 mt-6">No bookings found.</p>
      )}

      {/* Table */}
      {!loading && bookings.length > 0 && (
        <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Date Range</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium max-md:hidden">Payment</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking._id} 
                  className="border-t border-borderColor text-gray-500"
                >
                  {/* Car */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={booking.car?.image}
                      alt="car"
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <p className="font-medium max-md:hidden">
                      {booking.car?.brand} {booking.car?.model}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate?.split("T")[0]} to{" "}
                    {booking.returnDate?.split("T")[0]}
                  </td>

                  {/* Price */}
                  <td className="p-3">
                    {currency}
                    {booking.price}
                  </td>

                  {/* Payment */}
                  <td className="p-3 max-md:hidden">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      offline
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {booking.status === "pending" ? (
                      <select
                        onChange={(e) =>
                          changeBookingStatus(booking._id, e.target.value)
                        }
                        value={booking.status}
                        className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-500"
                            : "bg-red-100 text-red-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
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

export default ManageBookings;
