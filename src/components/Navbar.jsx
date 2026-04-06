import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, api, setIsOwner } =
    useAppContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Change Role
  const changeRole = async () => {
    try {
      setLoading(true);

      const res = await api.post("/api/owner/change-role");
      if (res?.data?.success) {
        localStorage.setItem("isOwner", "true");
        setIsOwner(true);

        toast.success(res.data.message);
        navigate("/owner");
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      onMouseDown={(e) => e.preventDefault()}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`select-none flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative ${
        location.pathname === "/" ? "bg-light" : "bg-white"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />
      </Link>

      {/* Menu */}
      <div
        onMouseDown={(e) => e.preventDefault()}
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
          open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"
        } ${location.pathname === "/" ? "bg-light" : "bg-white"}`}
      >
        {/* Links */}
        {menuLinks.map((link) =>
          link.external ? (
            <a
              key={link.path}
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              {link.name}
            </a>
          ) : (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `nav-link select-none focus:outline-none ${
                  isActive ? "text-primary font-medium" : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              {link.name}
            </NavLink>
          ),
        )}

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search cars"
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Actions */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            disabled={loading}
            onClick={(e) => {
              e.currentTarget.blur();
              isOwner ? navigate("/owner") : changeRole();
            }}
            className="select-none cursor-pointer disabled:opacity-50 
             focus:outline-none focus:ring-0"
          >
            {loading ? "Please wait..." : isOwner ? "Dashboard" : "List Cars"}
          </button>

          <button
            onClick={(e) => {
              e.currentTarget.blur();
              if (user) {
                logout();
              } else {
                setShowLogin(true);
              }
              setOpen(false);
            }}
            className="select-none cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull 
             transition-all text-white rounded-lg 
             focus:outline-none focus:ring-0 active:outline-none"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>
    </motion.div>
  );
};

export default Navbar;
