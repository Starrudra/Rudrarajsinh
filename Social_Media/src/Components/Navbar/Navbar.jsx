import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, User, Bell, PencilLine, LogOut } from "lucide-react";
import { auth } from "../../Firebase/Firebase";
import { UserContext } from "../../Context/PostContext";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { toast } from "react-toastify";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const { users } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, users]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/SignIn");
    });
  };

  const getLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
      location.pathname === path
        ? "bg-blue-100 text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
    }`;

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => {
          if (auth.currentUser) {
            auth.signOut().then(() => {
              navigate("/SignIn");
              toast.error("You were logged out due to inactivity.");
            });
          }
        },
        30 *60 * 1000
      );
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return (
    <nav className="bg-white shadow-lg px-4 py-3 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <Link to="/home" className="text-2xl font-bold text-blue-600">
          SocialSphere
        </Link>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    navigate(`/profile/${user.id}?viewOnly=true`);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={user.profilePic || "/default-avatar.png"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {user.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <ul className="flex items-center gap-5">
          <li>
            <Link to="/home" className={getLinkClass("/home")}>
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to={`/profile/${currentUser?.uid}`}
              className={getLinkClass(`/profile/${currentUser?.uid}`)}
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/Notification" className={getLinkClass("/Notification")}>
              <Bell className="w-5 h-5" />
              <span className="hidden sm:inline">Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/Post" className={getLinkClass("/Post")}>
              <PencilLine className="w-5 h-5" />
              <span className="hidden sm:inline">Post</span>
            </Link>
          </li>
          <li>
            <Link to="/saved" className={getLinkClass("/saved")}>
              <BsBookmark className="w-5 h-5" />
              <span className="hidden sm:inline">Saved</span>
            </Link>
          </li>
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
