import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/home"); // Redirect to the home or desired page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-red-500 text-6xl mb-4">
        <i className="fas fa-exclamation-triangle"></i>
      </div>
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={handleGoBack}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default Error;