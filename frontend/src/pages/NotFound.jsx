import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-cyan-600 px-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-6xl font-bold text-cyan-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sidan hittades inte</h2>
        <p className="text-gray-600 mb-6">
            Sidan hittades inte, eller saknas.
        </p>
        <Link
          to="/"
          className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
        >
          Tillbaka till startsidan
        </Link>
      </div>
    </div>
  );
};

export default NotFound;