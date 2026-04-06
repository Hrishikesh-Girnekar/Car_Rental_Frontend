import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [cars, setCars] = useState([]);

  // Fetch User
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        setIsAdmin(data.user.role === "admin");
      } else {
        logout();
      }
    } catch (error) {
      console.log(error);
      logout(); // important
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch Cars
  const fetchCars = async () => {
    try {
      const { data } = await api.get("/api/user/cars");
      if (data.success) setCars(data.cars);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    setIsAdmin(false);
    toast.success("Logged out");
    navigate("/");
  };

  // Load initial data
  useEffect(() => {
    fetchCars();
  }, []);

  // When token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser();
    } else {
      setAuthLoading(false);
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    api,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    isAdmin,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    authLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);