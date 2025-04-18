import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">SODV1253 - Final Project</div>
      <div className="navbar-links">
        <NavLink to="/" end className="nav-link">
          Home
        </NavLink>
        <NavLink to="/watchlist" className="nav-link">
          Watchlist
        </NavLink>
        <NavLink to="/portfolio" className="nav-link">
          Portfolio
        </NavLink>
        <NavLink to="/chat" className="nav-link">
          Chat
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
