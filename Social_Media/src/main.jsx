import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import PostContext from "./Context/PostContext.jsx";
import UserProvider from "./Context/UserProfileContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
        <PostContext>
          <UserProvider>
          <App />
          </UserProvider>
        </PostContext>
    </BrowserRouter>
  </StrictMode>
);
