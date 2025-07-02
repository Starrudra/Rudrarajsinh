// import React, { useState, useEffect } from "react";
// import { fetchUserCount, fetchContactCount } from "../../../api";
// import AdminNavbar from "../Navbar";
// import styles from "./styles.module.css"

// const MainAdmin = () => {
//     const [totalUsers, setTotalUsers] = useState(0);
//     const [totalContacts, setTotalContacts] = useState(0);

//     useEffect(() => {
//     const fetchCounts = async () => {
//         try {
//             console.log("Fetching user and contact counts...");

//             const users = await fetchUserCount();
//             console.log("Total Users from API:", users);
//             setTotalUsers(users);

//             const contacts = await fetchContactCount();
//             console.log("Total Contacts from API:", contacts);
//             setTotalContacts(contacts);
//         } catch (error) {
//             console.error("Error fetching counts:", error);
//         }
//     };

//     fetchCounts();
// }, []);

    
    

//     return (
//         <div>
//             <AdminNavbar />
//             <h1>Admin Dashboard</h1>
//             <div>
//                 <h2>Total Users: {totalUsers}</h2>
//                  <h2>Total Contacts: {totalContacts}</h2>  
//             </div>
//         </div>
//     );
// };

// export default MainAdmin;




import React, { useState, useEffect } from "react";
import { fetchUserCount, fetchContactCount } from "../../../api";
import AdminNavbar from "../Navbar";
import styles from "./styles.module.css";

const MainAdmin = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalContacts, setTotalContacts] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                console.log("Fetching user and contact counts...");
    
                const users = await fetchUserCount();
                console.log("Total Users from API:", users);
                setTotalUsers(users || 0); 
    
                const contacts = await fetchContactCount();
                console.log("Total Contacts from API:", contacts);
                setTotalContacts(contacts || 0); // ✅ Ensure we don't set undefined
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };
    
        fetchCounts();
    }, []);
    

    return (
        <div>
            <AdminNavbar />
            <div className={styles.dashboardContainer}>
                <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <h2>Total Users</h2>
                        <p>{totalUsers}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h2>Total Contacts</h2>
                        <p>{totalContacts}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainAdmin;
