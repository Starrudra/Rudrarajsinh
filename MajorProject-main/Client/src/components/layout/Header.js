import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../Hooks/useCategory";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logo, setLogo] = useState({ name: "", link: "" }); // State to store the logo details

  useEffect(() => {
    // Fetch the logo details when the component mounts
    const fetchLogo = async () => {
      try {
        const { data } = await axios.get("/api/v1/hpsettings/get-logo");
        if (data.success) {
          setLogo(data.logo);
        }
      } catch (error) {
        console.error("Failed to fetch logo.", error);
      }
    };

    const fetchCart = async () => {
      const token = localStorage.getItem("auth");
      const t = JSON.parse(token);

      const { data } = await axios.get("/api/v1/cart/fetchCart", {
        headers: {
          authtoken: t.token,
        },
      });

      setCart(data.length);
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-categories");
        if (data.success) {
          setCategories(data.category);
        }
      } catch (error) {
        console.error("Failed to fetch categories.", error);
      }
    };

    fetchLogo();
    fetchCart();
    fetchCategories();
  }, []);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Display the fetched logo with a link */}
          {logo.link && (
            <Link to="/">
              <img
                src={logo.link}
                className="logo"
                alt={logo.name || "Company Logo"}
                title={logo.name || "Company Logo"}
                style={{ maxHeight: "60px" }} // Adjust size as needed
              />
            </Link>
          )}

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2 mt-1">
                <SearchInput />
              </li>
              {!auth.token ? (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-user"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <NavLink className="nav-link mx-2" to="/signup">
                          <i className="fa-solid fa-user-pen fa-bounce"></i>{" "}
                          &nbsp;Register
                        </NavLink>
                      </li>

                      <li>
                        <NavLink className="nav-link mx-2" to="/login">
                          <i className="fa-solid fa-user-check fa-bounce text-success"></i>{" "}
                          &nbsp; Login
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-user"></i>
                      &nbsp;
                      {auth?.user?.name}
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          className="nav-link mx-2"
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="nav-item">
                        <NavLink
                          className="nav-link mx-2"
                          onClick={handleLogout}
                          to="/login"
                        >
                          <i className="fa-solid fa-user-xmark text-danger fa-fade"></i>{" "}
                          &nbsp; LogOut{" "}
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink className="nav-link mx-2" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="/categories"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              {auth.token && (
                <li className="nav-item">
                  <NavLink className="nav-link mx-2" to="/cart">
                    <i className="fa-solid fa-cart-shopping">
                      <Badge
                        count={cart} // Display the length of the cart items
                        size="small"
                        title="Your cart"
                        className=""
                        offset={[0, -20]}
                      ></Badge>
                    </i>
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
