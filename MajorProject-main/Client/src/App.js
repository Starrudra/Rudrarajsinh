import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/routes/Private";
import AdminRoute from "./components/routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Category from "./components/Category";
import Search from "./pages/Search";
import ProductDetail from "./pages/ProductDetail";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import DemoCart from "./pages/DemoCart";
import AdminOrderPanel from "./pages/Admin/AdminOrderPanel";
import HomePageSettings from "./pages/Admin/HomePageSettings";
import SliderImageSettings from "./pages/Admin/SliderImageSettings";
import HomePageBoxSettings from "./pages/Admin/HomePageBoxSettings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/category/all-categories" element={<Category />} />
        <Route path="/cart" element={<DemoCart />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
        </Route>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/orders" element={<AdminOrderPanel />} />
          <Route path="admin/hpsettings" element={<HomePageSettings />} />
          <Route
            path="admin/homepageboxsettings"
            element={<HomePageBoxSettings />}
          />
          <Route
            path="admin/slidersettings"
            element={<SliderImageSettings />}
          />
        </Route>
        <Route path="/cart" element={<DemoCart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/democart" element={<DemoCart />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
