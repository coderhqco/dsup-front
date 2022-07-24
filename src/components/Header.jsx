import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../store/userSlice';

function Header(){
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
                        <li className="nav-item">
                            <Link to='/' className="nav-link active" aria-current="page">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/help' className="nav-link" >Help</Link>
                        </li>
                        <li className="nav-item">
                            {!AuthUser ? 
                            <Link to='/enter-the-floor' className="nav-link">Login</Link>
                            :""}
                        </li>
                        <li className="nav-item">
                            {AuthUser ? 
                            <a className="nav-link" onClick={handleLogout}>Logout</a>
                        :""}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;