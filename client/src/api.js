import axios from "axios";

const API_URL = "http://localhost:5000/api/contacts";

// Fetch JWT token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

// Fetch all contacts
export const fetchContacts = async () => {
    return await axios.get(`${API_URL}/fetch`, getAuthHeaders());
};

//create a contact
export const createContact = async (contactData) => {
    return await axios.post(`${API_URL}/create`, contactData, getAuthHeaders());
};



// Update a contact


export const updateContact = async (id, contactData) => {
    console.log("Updating Contact:", id, contactData);
    
    return await axios.put(`${API_URL}/update/${id}`, contactData, getAuthHeaders());
};





// Delete a contact
export const deleteContact = async (id) => {
    return await axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
};



  
  // TO FETCH GLOBAL CONTacts
export const fetchGlobalContacts = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`, getAuthHeaders());
        console.log("Fetched Global Contacts:", response.data); // Debugging
        return response;
    } catch (error) {
        console.error("Error fetching global contacts:", error.response?.data || error.message);
        throw error;
    }
};

const USER_API_URL = "http://localhost:5000/api/users";

// Fetch total users count
export const fetchUserCount = async () => {
    try { 
        const response = await axios.get(`${USER_API_URL}/count`, getAuthHeaders());
        return response.data.totalUsers;
    } catch (error) {
        console.error("Error fetching user count:", error.response?.data || error.message);
        throw error;
    }
};
// Fetch total contact count
export const fetchContactCount = async () => {
    const token = localStorage.getItem("adminToken"); 
    if (!token) {
        console.error("No token found in localStorage");
        return 0; 
    }

    try {
        const response = await axios.get("http://localhost:5000/api/contacts/count", {
            headers: { Authorization: `Bearer ${token}` }, 
        });

        console.log("Full API Response for Contact Count:", response);

        // Extract the correct key `totalContacts`
        const contactCount = response.data.totalContacts;
        console.log("Final Extracted Contact Count:", contactCount);

        return contactCount ?? 0;
    } catch (error) {
        console.error("Error fetching contact count:", error.response?.data || error);
        return 0; 
    }
};





////////////////////////////////////////// ADMIN APIS ////////////////////////////////////////////////////////////////////////////////


const ADMIN_API_URL = "http://localhost:5000/api/contacts"; // Admin-specific route

// Fetch admin token from localStorage
const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("adminToken"); // Use admin token
    if (!token) {
        console.error("No admin token found in localStorage");
        return {};
    }
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

// Fetch all contacts (Admin)
export const fetchAdminContacts = async () => {
    try {
        const response = await axios.get(`${ADMIN_API_URL}/all`, getAdminAuthHeaders());
        console.log("Fetched Admin Contacts:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin contacts:", error.response?.data || error.message);
        throw error;
    }
};

// Create a new contact (Admin)
export const createAdminContact = async (contactData) => {
    return await axios.post(`${ADMIN_API_URL}/create`, contactData, getAdminAuthHeaders());
};

// Update a contact (Admin)
export const updateAdminContact = async (id, contactData) => {
    console.log("Admin updating contact:", id, contactData);
    return await axios.put(`${ADMIN_API_URL}/update/${id}`, contactData, getAdminAuthHeaders());
};

// Delete a contact (Admin)
export const deleteAdminContact = async (id) => {
    return await axios.delete(`${ADMIN_API_URL}/delete/${id}`, getAdminAuthHeaders());
};