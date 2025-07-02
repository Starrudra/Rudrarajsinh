import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css"; // Ensure styles are correctly imported

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login"); // Redirect to Login Page
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Admin Panel</h1>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/admin" className={styles.navLink}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/manage-users" className={styles.navLink}>
            Manage Users
          </Link>
        </li>
        <li>
          <Link to="/admin/Global-contact" className={styles.navLink}>
            Global Contacts
          </Link>
        </li>
        <li>
          <Link to="/admin/create-team" className={styles.navLink}>
            Create Team
          </Link>
        </li>
        
      </ul>
      <button className={styles.logoutbtn} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
