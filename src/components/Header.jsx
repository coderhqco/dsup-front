import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice.js";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap-icons/font/bootstrap-icons.css";

function Header() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/enter-the-floor");
  };
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          DSUP
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
          data-toggle="collapse"
          data-target=".navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {AuthUser ? (
              <li className="nav-item">
                <Link
                  to="/voter-page"
                  className="nav-link fs-5 active"
                  aria-current="page">
                  Voter Page
                </Link>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item">
              {AuthUser ? (
                <Link to="/search" className="nav-link fs-5 active">
                  Search and Sort Bills
                </Link>
              ) : null}
            </li>
            <li className="nav-item">
              {!AuthUser ? (
                <Link to="/enter-the-floor" className="nav-link fs-5">
                  Enter The Floor
                </Link>
              ) : (
                ""
              )}
            </li>

            <Dropdown>
              <Dropdown.Toggle className="">
                <i className="bi bi-gear"> </i> Settings
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#">Help</Dropdown.Item>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                {AuthUser && (
                  <Dropdown.Item href="#">
                    <span onClick={handleLogout}>Logout</span>
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
