import React, { useEffect } from "react";

const Toast = ({ message, show, onClose, duration = 2000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div
      className="
        fixed bottom-5 right-5 z-50
        bg-pink-200 text-gray-700 font-medium
        px-5 py-3
        rounded-lg
        shadow-md
        animate-fade-in-up
      "
    >
      {message}
    </div>
  );
};

export default Toast;