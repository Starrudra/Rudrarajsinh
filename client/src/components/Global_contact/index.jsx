import React, { useEffect, useState } from "react";
import { fetchGlobalContacts } from "../../api"; // Import new API function
import styles from "./styles.module.css";

const GlobalContact = () => {
  const [contacts, setContacts] = useState([]);

useEffect(() => {
    loadContacts();
}, []);

const loadContacts = async () => {
    try {
        const res = await fetchGlobalContacts();
        console.log("Contacts in Frontend:", res.data); // Debugging
        setContacts(res.data);
    } catch (error) {
        console.error("Error loading global contacts:", error);
    }
};


  return (
    <div className={styles.contactContainer}>
      <h1>Global Contact Diary</h1>

<div className={styles.contactList}>
  {contacts.length > 0 ? (
    contacts.map((contact) => (
      <div key={contact._id} className={styles.contactCard}>
        <h3>{contact.name}</h3>
        <p>Email: {contact.email}</p>
        <p>Phone: {contact.phone}</p>
        <p>Created By: {contact.user ? `${contact.user.firstName} ${contact.user.lastName}` : "Unknown"}</p>
        </div>
    ))
  ) : (
    <p>No global contacts available.</p>
  )}
</div>

    </div>
  );
};

export default GlobalContact;
