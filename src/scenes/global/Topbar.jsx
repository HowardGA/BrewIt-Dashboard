import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ColorModeContext } from "../../theme";  // Update with correct path

const Navbar = ({ setIsLoggedIn }) => {
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem("accessToken");

    // Update isLoggedIn state
    if (setIsLoggedIn && typeof setIsLoggedIn === "function") {
      setIsLoggedIn(false);
    }

    // Redirect to the login screen after logout
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" to="/" style={{ color: "black" }}>
          Brew It!
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className="nav-link" to="/dashboard" style={{ color: "black" }}>
              Dashboard
            </Link>
            <Link className="nav-link" to="/history" style={{ color: "black" }}>
              History
            </Link>
          </div>
        </div>
        <div className="d-flex">
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
