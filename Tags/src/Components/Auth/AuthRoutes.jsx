import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children, access }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (access === "protected" && !user) {
    return <Navigate to="/signin" replace />;
  }

  if (access === "public" && user) {
    return <Navigate to="/" replace />;
  }

  // Allow access
  return children;
};

export default AuthRoute;
