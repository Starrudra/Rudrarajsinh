import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";

const HomePageSettings = () => {
  const [logo, setLogo] = useState(null); // Existing logo details or null if not found
  const [newLogoLink, setNewLogoLink] = useState(""); // New logo link for uploading or updating
  const [logoName, setLogoName] = useState(""); // New logo name for uploading or updating

  // Fetch the current logo
  const fetchLogo = async () => {
    try {
      const { data } = await axios.get("/api/v1/hpsettings/get-logo");
      if (data.success) {
        setLogo(data.logo);
        setNewLogoLink(data.logo.link); // Initialize newLogoLink with existing logo link
        setLogoName(data.logo.name); // Initialize logoName with existing logo name
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.info("No logo found. Please upload a new one.");
      } else {
        toast.error("Failed to fetch logo.");
      }
    }
  };

  // Upload a new logo
  const handleUploadLogo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/hpsettings/upload-logo", {
        name: logoName,
        LogoLink: newLogoLink,
      });
      if (data.success) {
        toast.success(data.message);
        fetchLogo(); // Re-fetch logo to show the uploaded one
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to upload logo.");
    }
  };

  // Update the existing logo
  const handleUpdateLogo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/v1/hpsettings/update-logo", {
        name: logoName,
        LogoLink: newLogoLink,
      });
      if (data.success) {
        toast.success(data.message);
        fetchLogo(); // Re-fetch logo to show the updated one
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update logo.");
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  return (
    <Layout>
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="bg-white rounded p-4">
              <h1 className="text-center mb-4">Home Page Settings</h1>

              {logo ? (
                <div className="text-center mb-4">
                  <h3 className="mb-3">Current Logo:</h3>
                  <img
                    src={logo.link}
                    alt="Company Logo"
                    className="img-fluid"
                    style={{ maxHeight: "200px" }}
                  />
                  <p className="mt-2">
                    <strong>Company Name:</strong> {logo.name}
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted mb-4">
                  No logo found. Upload a new logo below.
                </p>
              )}

              <form>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    placeholder="Enter Company Name"
                    value={logoName}
                    onChange={(e) => setLogoName(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    placeholder="Enter Logo URL"
                    value={newLogoLink}
                    onChange={(e) => setNewLogoLink(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div className="text-center">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={logo ? handleUpdateLogo : handleUploadLogo}
                  >
                    {logo ? "Update Info" : "Upload Info"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePageSettings;
