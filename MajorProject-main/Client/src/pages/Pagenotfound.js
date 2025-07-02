import React from "react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";

const Pagenotfound = () => {
  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>404 - Page Not Found</h1>
        <p style={styles.text}>
          Oops! The page you are looking for does not exist.
        </p>
        <Link rel="stylesheet" to="/">
          <button className="btn btn-secondary">Go Back</button>
        </Link>
      </div>
    </Layout>
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

export default Pagenotfound;
