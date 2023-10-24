// import logo from './logo.svg';
import React from "react";
import logo from './logo.png'
import {Link,useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import jwtDecode from 'jwt-decode';

function Home(){
  const AuthUser = useSelector((state) => state.AuthUser.user);
  console.log(AuthUser)
  const isRefreshTokenExpired = () => {
    try {
      const decodedToken = jwtDecode(AuthUser.token.refresh);
      if (decodedToken.exp < Date.now() / 1000) {
        // Token has expired
        return true;
      }
      return false;
    } catch (error) {
      // Failed to decode the token (e.g., invalid format)
      return true;
    }
  };

  return (
    <div className="container">
      <div className="row"></div>
      <div className="row mt-5">
      <div className="col-sm-12 col-md-4 col-lg-4 mt-4">
          <div className="container text-center ">
            <a className="row text-decoration-none text-dark">
              <img src={logo} 
                alt="Democracy Straight Up"/>
            </a>
          </div>
        </div>
        <div className="col-sm-12 col-md-8 col-lg-8">
          <div className="text-center ">
            <h1 className="m-4">Welcome to the Democracy Straight-Up Project!</h1>
            <div className="text-center">
              <h2 className="text-secondary m-4">Vote directly on federal legislation.</h2>
                <div className="row">
                {isRefreshTokenExpired()===true ? 
                  <div className="row">
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <Link to="/claim-your-seat" className="btn btn-lg btn-primary m-3 text-decoration-none"> Claim Your Seat</Link>
                    </div>
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <Link to="/enter-the-floor" className="btn btn-lg btn-primary m-3 text-decoration-none"> Enter the Floor</Link>
                    </div>
                  </div>
                  :""}
                </div>
            </div>
          </div>
        </div>
        
      </div>  
    </div>
  );
}

export default Home;
