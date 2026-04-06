import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { api, isAdmin, currency, authLoading } = useAppContext();

  const [data, setData] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    activeRentals: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Users",
      value: data.totalUsers,
      icon: assets.listIconColored,
    },
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Active Rentals",
      value: data.activeRentals,
      icon: assets.listIconColored,
    },
  ];

  // Fetch Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/dashboard");

      if (res.data) {
        setData({
          totalUsers: res.data.totalUsers || 0,
          totalCars: res.data.totalCars || 0,
          totalBookings: res.data.totalBookings || 0,
          pendingBookings: res.data.pendingBookings || 0,
          activeRentals: res.data.activeRentals || 0,
          totalRevenue: res.data.totalRevenue || 0,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Auth Loading
  if (authLoading) {
    return <div className="p-10 text-gray-500">Loading...</div>;
  }

  // Protect Route
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* Loading */}
      {loading && <p className="text-gray-500 mt-6">Loading dashboard...</p>}

      {/* Content */}
      {!loading && (
        <>
          {/* Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
            {dashboardCards.map((card) => (
              <div
                key={card.title} //FIXED
                className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
              >
                <div>
                  <h1 className="text-xs text-gray-500">{card.title}</h1>
                  <p className="text-lg font-semibold">{card.value}</p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <img src={card.icon} alt="" className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>

          {/* Revenue */}
          <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-xs">
            <h1 className="text-lg font-medium">Total Revenue</h1>
            <p className="text-gray-500">Revenue from confirmed bookings</p>
            <p className="text-3xl mt-6 font-semibold text-primary">
              {currency}
              {data.totalRevenue}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;