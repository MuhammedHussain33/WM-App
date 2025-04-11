import React from "react";

const Notification = ({ message, type = "success", onClose }) => {
  const baseStyle =
    "fixed top-5 right-5 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-500";

  const typeStyle = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`${baseStyle} ${typeStyle[type]}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          className="ml-4 text-white font-bold"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
