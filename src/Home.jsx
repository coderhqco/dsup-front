// import logo from './logo.svg';
import React from "react";

import logo from "./CYS-Logo.png";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import jwtDecode from "jwt-decode";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

function Home() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  console.log(AuthUser);
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
              <img
                src={logo}
                alt="Democracy Straight Up"
                className="img-fluid mx-auto"
                style={{ maxWidth: "80%" }}
              />
            </a>
          </div>
        </div>
        <div className="col-sm-12 col-md-8 col-lg-8">
          <div className="text-center mt-5">
            <h2 className="my-4">
              Welcome to the Claim Your Seat Voting Portal
            </h2>
            <h3 className="my-4">
              Where the will of the people becomes the law of the land.
            </h3>
            <div className="text-center">
              <h4 className="text-secondary m-4">
                Start voting directly on federal legislation
              </h4>
              <div className="row">
                {isRefreshTokenExpired() === true ? (
                  <div className="row">
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <OverlayTrigger
                        overlay={
                          <Tooltip>
                            <strong>Sign Up </strong>
                          </Tooltip>
                        }>
                        <Link
                          to="/claim-your-seat"
                          className="btn btn-md btn-primary m-3 text-decoration-none">
                          {" "}
                          Claim Your Seat
                        </Link>
                      </OverlayTrigger>
                    </div>
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <Link
                        to="/enter-the-floor"
                        className="btn btn-md btn-primary m-3 text-decoration-none">
                        {" "}
                        Enter The Floor
                      </Link>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
