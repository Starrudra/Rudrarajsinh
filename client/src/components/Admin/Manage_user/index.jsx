

import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../Navbar";
import styles from "./styles.module.css";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = ({ target: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users", data);
      setSuccess("User created successfully!");
      setData({ firstName: "", lastName: "", email: "", password: "" });
      setError("");
      fetchUsers();
    } catch (error) {
      setSuccess("");
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setSuccess("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className={styles.container}>
        <h1 className={styles.heading}>Manage Users</h1>

        {/* Create User Form */}
        <div className={styles.form_wrapper}>
          <h2 className={styles.subheading}>Create New User</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" placeholder="First Name" name="firstName" onChange={handleChange} value={data.firstName} required className={styles.input} />
            <input type="text" placeholder="Last Name" name="lastName" onChange={handleChange} value={data.lastName} required className={styles.input} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email} required className={styles.input} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} value={data.password} required className={styles.input} />
            {error && <div className={styles.error_msg}>{error}</div>}
            {success && <div className={styles.success_msg}>{success}</div>}
            <button type="submit" className={styles.create_btn}>Create User</button>
          </form>
        </div>

        {/* User List Table */}
        <h2 className={styles.subheading}>User List</h2>
        <div className={styles.table_wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <button className={styles.delete_btn} onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={styles.no_data}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageUser;
