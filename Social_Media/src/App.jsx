import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile";
import Notification from "./Components/Notification/Notification";
import Post from "./Components/Post/Post";
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/SignUp/SignUp";
import Loader from "./Components/Others/Loader";
import Chat from "./Components/Chat/Chat";
import SavedPosts from "./Components/SavedPosts/SavedPosts";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Error from "./Components/Others/Error";

const App = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase(); 
  const HideNavbar = currentPath === "/signin" || currentPath === "/signup";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <Loader />;
    return isAuthenticated ? children : <Navigate to="/signin" />;
  };

  return (
    <>
      {/* Show Navbar only if not on SignIn or SignUp page */}
      {!HideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Error />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loader"
          element={
            <ProtectedRoute>
              <Loader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <SavedPosts />
            </ProtectedRoute>
          }
        />
      </Routes>

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
    </>
  );
};

export default App;
