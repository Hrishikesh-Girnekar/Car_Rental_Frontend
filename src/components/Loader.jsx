import React from "react";

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center ${
        fullScreen ? "min-h-screen" : "py-10"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>

      <p className="mt-3 text-sm text-gray-500 animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default Loader;