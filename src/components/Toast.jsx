// src/components/Toast.jsx
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
    <div className="fixed bottom-5 right-5 bg-pink-600 text-white px-4 py-2 rounded shadow-lg transition-all duration-300">
      {message}
    </div>
  );
};

export default Toast;
