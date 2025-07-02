import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Category from "./Components/Category/Category";
import Sidebar from "./Components/Sidebar/Sidebar";
import SignUp from "./Components/SignUp/SignUp";
import SignIn from "./Components/SignIn/SignIn";
import TagPage from "./Components/Tags/Tags";
import OverviewPage from "./Components/Tags/Overview";
import AuthRoute from "./Components/Auth/AuthRoutes";

const App = () => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/signup" || location.pathname === "/signin";

  return (
    <div className="flex h-screen overflow-hidden">
      {!isAuthRoute && <Sidebar />}

      <div className="flex-1 bg-[#1f2937] overflow-auto">
        <Routes>
          {/* Public Pages */}
          <Route
            path="/signup"
            element={
              <AuthRoute access="public">
                <SignUp />
              </AuthRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <AuthRoute access="public">
                <SignIn />
              </AuthRoute>
            }
          />

          {/* Protected Pages */}
          <Route
            path="/"
            element={
              <AuthRoute access="protected">
                <Category />
              </AuthRoute>
            }
          />
          <Route
            path="/tags/:categoryName"
            element={
              <AuthRoute access="protected">
                <TagPage />
              </AuthRoute>
            }
          />
          <Route
            path="/overview/:categoryName"
            element={
              <AuthRoute access="protected">
                <OverviewPage />
              </AuthRoute>
            }
          />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ backgroundColor: "#1f2937", color: "#fff" }}
      />
    </div>
  );
};

export default App;
