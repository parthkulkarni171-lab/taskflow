import { useState } from "react";
import logo from "../assets/logo.png";
import "./Navbar.css";

function Navbar({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar">

      <div className="logo-section">
        <img src={logo} alt="TaskFlow logo" />
        <h1>TaskFlow</h1>
      </div>

      <div className="profile-wrapper">

        <button
          className="profile-section"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span>{user?.name || "User"}</span>

          <span className="arrow">
            {showMenu ? "▲" : "▼"}
          </span>
        </button>

        {showMenu && (
          <div className="profile-menu">

            <div className="profile-info">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || ""}</span>
            </div>

            <div className="menu-divider"></div>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;