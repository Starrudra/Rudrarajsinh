import React, { useEffect, useState } from "react";
import AdminNavbar from "../Navbar";
import { 
    fetchAdminContacts, createAdminContact, updateAdminContact, deleteAdminContact 
} from "../../../api"; // Import new admin API
import styles from "./styles.module.css";

const AdminGlobal = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetchAdminContacts();
      setContacts(res);
    } catch (error) {
      console.error("Error fetching admin contacts:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedContact = await updateAdminContact(editingId, formData);
        setContacts(contacts.map((contact) =>
          contact._id === editingId ? updatedContact.data : contact
        ));
      } else {
        const newContact = await createAdminContact(formData);
        setContacts([...contacts, newContact.data]);
      }
      setFormData({ name: "", email: "", phone: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving admin contact:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminContact(id);
      setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error("Error deleting admin contact:", error);
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact._id);
    setFormData({ name: contact.name, email: contact.email, phone: contact.phone });
  };

  return (
    <>
      <AdminNavbar />
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h2>{editingId ? "Edit Contact" : "Add New Contact"}</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <button type="submit">{editingId ? "Update" : "Add"} Contact</button>
          </form>
        </div>

        <div className={styles.contactListContainer}>
          <h2>Admin Contact List</h2>
          <div className={styles.contactList}>
            {contacts.map((contact) => (
              <div key={contact._id} className={styles.contactCard}>
                <h3>{contact.name}</h3>
                <p>Email: {contact.email}</p>
                <p>Phone: {contact.phone}</p>
                <div className={styles.buttonGroup}>
                  <button onClick={() => handleEdit(contact)} className={styles.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(contact._id)} className={styles.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminGlobal;
