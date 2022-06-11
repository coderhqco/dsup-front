import React from 'react';

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (   
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container">
                <a className="navbar-brand fw-bold fs-4" href="/">DSUP</a>
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
                    <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/help">Help</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/enter-the-floor">Login</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        );
    }
}

export default Header;