import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaSave,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import axios from "axios";
import "../CSS/userProfile.css";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: auth?.user?.name || "",
    password: "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth");
      const t = JSON.parse(token);
      console.log(t.token);

      const response = await axios.put("/api/v1/auth/profile", formData, {
        headers: {
          authtoken: t.token, // Authorization header with the token
          "Content-Type": "application/json", // Content-Type header
          // Add other custom headers if needed
        },
      });
      console.log("Profile updated successfully:", response.data);
      toast.success("Profile updated successfully!");
      if (response?.error) {
        toast.error(response?.error);
      } else {
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = response?.data?.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success(response.message);
        // console.log(response?.data?.updatedUser);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Internal Server Error in Updating User");
    }
  };

  return (
    <Layout>
      <div className="container-fluid mt-3 pt-3">
        <div className="row mb-5">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <center>
              <div className="container mt-2 row">
                <div className="row">
                  <div className="">
                    <div className="profile-section">
                      <h3>Personal Information</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="name">
                            <FaUser className="icon" /> Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="password">
                            <VscWorkspaceTrusted className="icon" />
                            Change Password
                          </label>
                          <div className="input-group">
                            <input
                              type={passwordVisible ? "text" : "password"}
                              className="form-control"
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={togglePasswordVisibility}
                              >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">
                            <FaEnvelope className="icon" /> Email address
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={auth?.user?.email}
                            disabled
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">
                            <FaPhone className="icon" /> Phone Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="address">
                            <FaHome className="icon" /> Address
                          </label>
                          <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-outline-success mt-2"
                        >
                          <FaSave className="icon" /> Save Changes
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </center>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
