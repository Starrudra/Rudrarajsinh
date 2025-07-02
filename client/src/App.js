import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Main from "./components/Main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/navbar";
import ContactManager from "./components/contact";
import Global_contact from "./components/Global_contact";
import AdminNavbar from "./components/Admin/Navbar";
import Admin from "./components/Admin/Main";
import Manage_user from "./components/Admin/Manage_user";
import Create_team from "./components/Admin/Create_team";
import Admin_global from "./components/Admin/Global_contact";  
import "./App.css"; 
function App() {
  const user = localStorage.getItem("token");
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup" || location.pathname==="/admin" || location.pathname==="/Admin"  || location.pathname==="/admin-navbar"  || location.pathname==="/admin/manage-users" || location.pathname==="/admin/create-team" || location.pathname==="/admin/Global-contact";
  return (
    <div className="appContainer">
      {!hideNavbar && <Navbar />}
      
      <div className="contentWrapper">
    
<Routes>
    {user ? (
        <>
            <Route path="/" element={<Main />} />
            <Route path="/contacts" element={<ContactManager />} />
            <Route path="/Global_contact" element={<Global_contact />} />
            <Route path="*" element={<Navigate replace to="/" />} />
        </>
    ) : (
        <Route path="/" element={<Navigate replace to="/login" />} />
    )}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/admin-navbar" element={<AdminNavbar />} /> 
    <Route path="/admin" element={<Admin />} /> 
    <Route path="/admin/manage-users" element={<Manage_user/>}/>
    <Route path="/admin/create-team" element={<Create_team/>}/>
    <Route path="/admin/Global-contact" element={<Admin_global/>}/> 



    <Route path="*" element={<Navigate replace to="/login" />} />
</Routes>

      </div>
    </div>
  );
}

export default App;
