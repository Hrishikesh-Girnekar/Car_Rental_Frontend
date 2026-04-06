import React, { useState } from "react";
import { assets, ownerMenuLinks } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, api, fetchUser } = useAppContext();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update Profile Image
  const updateImage = async () => {
    if (!image) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      const res = await api.post("/api/owner/update-image", formData);

      if (res.data.success) {
        toast.success(res.data.message);
        fetchUser();
        setImage(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
      {/* Profile Image */}
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image || "https://via.placeholder.com/100"
            }
            alt="profile"
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover"
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 left-0 right-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>

      {/* Save Button */}
      {image && (
        <button
          onClick={updateImage}
          disabled={loading}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
          <img src={assets.check_icon} width={13} alt="" />
        </button>
      )}

      {/* User Name */}
      <p className="mt-2 text-base max-md:hidden">{user?.name || "Owner"}</p>

      {/* Menu */}
      <div className="w-full">
        {ownerMenuLinks.map((link) => (
          <NavLink
            key={link.path} 
            to={link.path}
            className={({ isActive }) =>
              `relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
                isActive ? "bg-primary/10 text-primary" : "text-gray-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img src={isActive ? link.coloredIcon : link.icon} alt="icon" />

                <span className="max-md:hidden">{link.name}</span>

                {isActive && (
                  <div className="bg-primary w-1.5 h-8 rounded-l right-0 absolute"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
