import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice.js';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap-icons/font/bootstrap-icons.css';



function Header() {
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout())
        navigate('/enter-the-floor')
    }
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container">
                <Link to='/' className="navbar-brand fw-bold fs-4" >DSUP</Link>
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
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">
                        {AuthUser ?
                            <li className="nav-item">
                                <Link to='/voter-page' className="nav-link fs-5 active" aria-current="page">Voter Page</Link>
                            </li>
                            : ""}
                        <li className="nav-item">
                            {AuthUser ?
                                <Link to='/search' className="nav-link fs-5 active" >Search and Sort Bills</Link>
                                : ""}
                        </li>
                        <li className="nav-item">
                            {!AuthUser ?
                                <Link to='/enter-the-floor' className="nav-link fs-5">Enter The Floor</Link>
                                : ""}
                        </li>
                        {/* <li className="nav-item">
                            <Link to='/help' className="nav-link fs-5" >Help</Link>
                        </li>
                        <li className="nav-item">
                            {AuthUser ?
                                <a className="nav-link fs-5" onClick={handleLogout}>Logout</a>
                                : ""}
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fs-5" to={'/settings'}> Settings <i className="bi bi-gear-fill"></i></Link>
                        </li> */}
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                Settings <i className="bi bi-gear-fill"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1"><Link to='/help' >Help</Link></Dropdown.Item>
                                <Dropdown.Item href="#/action-3"><Link to={'/settings'}> Settings </Link></Dropdown.Item>
                                {AuthUser ?
                                    <Dropdown.Item href="#/action-2"><a onClick={handleLogout}>Logout</a></Dropdown.Item>
                                    : ""}

                            </Dropdown.Menu>
                        </Dropdown>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;