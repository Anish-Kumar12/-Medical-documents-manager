import React, { useEffect } from "react";

const Alert = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = message.type === "success"
    ? "bg-green-200 text-green-800"
    : "bg-red-200 text-red-800";

  return (
    <div
      className={`${bgColor} fixed bottom-4 right-4 px-4 py-2 rounded shadow-md z-50 cursor-pointer`}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
    >
      {message.text}
    </div>
  );
};

export default Alert;