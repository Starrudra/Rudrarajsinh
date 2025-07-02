import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

const Main = () => {
  // const [firstName, setFirstName] = useState("Guest");

  const storedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className={styles.mainContainer}>
      <div className={styles.welcomeSection}>
        <h2>Hello,Everyone👋</h2>
        <p>
          Welcome to my Contact Manager app! Here you can add, edit, and manage
          your contacts easily.
        </p>
      </div>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <h3>🔍 Search Contacts</h3>
          <p>Quickly find contacts using the built-in search feature.</p>
        </div>

        <div className={styles.featureCard}>
          <h3>📋 Manage Contacts</h3>
          <p>Easily add, edit, or delete contacts with a simple interface.</p>
        </div>

        <div className={styles.featureCard}>
          <h3>🔒 Secure & Private</h3>
          <p>Your contact information is stored securely with authentication.</p>
        </div>
      </section>
    </div>
  );
};

export default Main;

