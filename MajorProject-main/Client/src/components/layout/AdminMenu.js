import React from "react";
import { NavLink } from "react-router-dom";
import "../../pages/CSS/AdminMenu.css";

const AdminMenu = () => {
  return (
    <div className="text-center">
      <div className="list-group">
        <h4>Admin Panel</h4>
        <NavLink
          to="/dashboard/admin/create-category"
          className="list-group-item list-group-item-action"
        >
          Create Category
        </NavLink>
        <NavLink
          to="/dashboard/admin/create-product"
          className="list-group-item list-group-item-action"
        >
          Create Product
        </NavLink>
        <NavLink
          to="/dashboard/admin/products"
          className="list-group-item list-group-item-action"
        >
          Products
        </NavLink>
        <NavLink
          to="/dashboard/admin/users"
          className="list-group-item list-group-item-action"
        >
          Users
        </NavLink>
        <NavLink
          to="/dashboard/admin/orders"
          className="list-group-item list-group-item-action"
        >
          All Orders
        </NavLink>
        <NavLink
          to="/dashboard/admin/hpsettings"
          className="list-group-item list-group-item-action"
        >
          Company Logo
        </NavLink>
        <NavLink
          to="/dashboard/admin/slidersettings"
          className="list-group-item list-group-item-action"
        >
          Slider Images
        </NavLink>
        <NavLink
          to="/dashboard/admin/homepageboxsettings"
          className="list-group-item list-group-item-action"
        >
          Home Page Box
        </NavLink>
      </div>
    </div>
  );
};

export default AdminMenu;
