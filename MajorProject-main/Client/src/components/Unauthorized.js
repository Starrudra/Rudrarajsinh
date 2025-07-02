import React from "react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div>
      <Layout>
        <div style={styles.container}>
          <h1 style={styles.heading}>401 - Unauthorized access detected!!</h1>
          <p style={styles.text}>Please Login to continue</p>
          <Link rel="stylesheet" to="/login">
            <button className="btn btn-secondary">Login</button>
          </Link>
        </div>
      </Layout>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "50vh",
    backgroundColor: "#f8f8f8",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#333",
  },
  text: {
    fontSize: "1rem",
    color: "#666",
  },
};

export default Unauthorized;
