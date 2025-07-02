import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css"; // Import Navbar styles

const Navbar = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.reload();
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Connector</h1>
      <ul className={styles.navLinks}>
        <li><Link to="/" className={styles.navLink}>Home</Link></li>
        <li><Link to="/contacts" className={styles.navLink}>My Contacts</Link></li>
        <li><Link to="/Global_contact" className={styles.navLink}>Contact Diary</Link></li>
      </ul>
      <button className={styles.logoutbtn} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
