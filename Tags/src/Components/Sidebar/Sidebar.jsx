import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiLogOut } from "react-icons/fi";
import { BsGrid1X2 } from "react-icons/bs";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fetch user's name from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);


const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser"); 
    navigate("/signin");
  };
  
  

  const menuItems = [
    { label: "Categories", icon: <BsGrid1X2 size={20} />, path: "/" },

  ];

  return (
    <div
      className={`bg-[#111827] text-white h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-14" : "w-80"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <span className="text-lg font-semibold">
            <img
              src="/Frame.svg"
              alt="Logo"
              className="h-18 w-auto object-contain"
            />
          </span>
        )}
        <button onClick={toggleSidebar}>
          <FiChevronLeft
            className={`text-3xl transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.label}
            className={`flex items-center gap-4 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition 
              ${location.pathname === item.path ? "bg-[#1f2937] text-green-400" : ""}`}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/300"
          alt="User"
          className="w-12 h-12 rounded-full"
        />
        {!isCollapsed && (
          <div className="flex flex-col text-sm">
            <span>{userName || "Guest"}</span>
            <span className="text-gray-400">Admin</span>
          </div>
        )}
       {!isCollapsed&&( <button
          className="ml-auto text-gray-400 hover:text-red-500"
          onClick={handleLogout}
        >
          <FiLogOut />
        </button>)}
      </div>
    </div>
  );
};

export default Sidebar;
