import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function Toast({ id, type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000); // Auto close setelah 5 detik

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const types = {
    success: {
      bg: "bg-green-500",
      icon: <CheckCircle size={24} />,
      borderColor: "border-green-600",
    },
    error: {
      bg: "bg-red-500",
      icon: <XCircle size={24} />,
      borderColor: "border-red-600",
    },
    warning: {
      bg: "bg-yellow-500",
      icon: <AlertTriangle size={24} />,
      borderColor: "border-yellow-600",
    },
    info: {
      bg: "bg-blue-500",
      icon: <Info size={24} />,
      borderColor: "border-blue-600",
    },
  };

  const config = types[type] || types.info;

  return (
    <div
      className={`flex items-start gap-3 ${config.bg} text-white px-4 py-3 rounded-lg shadow-lg border-l-4 ${config.borderColor} min-w-[300px] max-w-md animate-slide-in`}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
}