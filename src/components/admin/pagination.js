// src/components/admin/Pagination.jsx
import React from "react";

export const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4 space-x-2">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 border rounded-lg transition ${
            currentPage === index + 1
              ? "bg-green-600 text-white border-green-600"
              : "border-gray-300 hover:bg-gray-200"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};