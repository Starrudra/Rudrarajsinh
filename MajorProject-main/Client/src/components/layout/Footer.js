import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../pages/CSS/footer.css";

const Footer = () => {
  const [footerLogo, setFooterLogo] = useState(""); // State to store the logo URL
  const [companyName, setCompanyName] = useState(""); // State to store the company name

  useEffect(() => {
    // Fetch the footer logo and company name when the component mounts
    const fetchLogoAndName = async () => {
      try {
        const { data } = await axios.get("/api/v1/hpsettings/get-logo");
        if (data.success) {
          setFooterLogo(data.logo.link); // Set logo URL
          setCompanyName(data.logo.name); // Set company name
        }
      } catch (error) {
        console.error("Failed to fetch footer logo and name.", error);
      }
    };

    fetchLogoAndName();
  }, []);

  return (
    <>
      <footer className="footer-distributed" id="contact">
        <div className="footer-left">
          {/* Display the fetched footer logo */}
          {footerLogo && (
            <img src={footerLogo} className="footer-img" alt="Footer Logo" />
          )}
          <p className="footer-links">
            <Link to="/" className="link-1">
              Home
            </Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/policy">Privacy</Link>
          </p>
          <p className="footer-company-name">
            {" "}
            &copy; {companyName || "SnowBizz Clothing"}{" "}
          </p>
        </div>
        <div className="footer-center">
          <div className="infor">
            <div>
              <i className="fa fa-phone" />
              +91-9726786899
            </div>
            <div>
              <i className="fa fa-envelope" />
              darshan25503@gmail.com
            </div>
          </div>
        </div>
        <div className="footer-right">
          <p className="footer-company-about">
            Exclusivity: We handpick designer pieces that you won't find just
            anywhere. Each item in our store is carefully selected for its
            uniqueness and style. Quality: We are committed to offering you the
            best in terms of materials, craftsmanship, and durability. Our
            selection ensures you're not only fashionable but comfortable too.
            Customer-Centric Approach: Our team is dedicated to providing you
            with exceptional customer service. We're here to answer your
            questions and help you make the perfect fashion choices.
          </p>
          <div className="footer-icons">
            <Link to="https://www.instagram.com/darshan25503/">
              <i className="fa fa-instagram" />
            </Link>
            <Link to="#">
              <i className="fa fa-linkedin" />
            </Link>
          </div>
        </div>
        <center>
          <span>
            All Rights Reserved &copy; {companyName || "SnowBizz Clothing"}
          </span>
        </center>
      </footer>
    </>
  );
};

export default Footer;
