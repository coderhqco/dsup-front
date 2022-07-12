import React from 'react';
import {Link} from 'react-router-dom';

function Header(){
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
                            {/* <a  aria-current="page" href="/">Home</a> */}
                        </li>
                        <li className="nav-item">
                            <Link to='/help' className="nav-link" >Help</Link>
                            {/* <a className="nav-link" href="/help">Help</a> */}
                        </li>
                        <li className="nav-item">
                            <Link to='/enter-the-floor' className="nav-link">Login</Link>
                            {/* <a className="nav-link" href="/enter-the-floor">Login</a> */}
                        </li>
                        <li className="nav-item">
                            <Link to='/' className="nav-link">Logout</Link>
                            {/* <a className="nav-link" href="#">Logout</a> */}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;