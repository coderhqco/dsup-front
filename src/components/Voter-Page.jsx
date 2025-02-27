import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../store/conf";
import { circle, authenticate, sec_del } from "../store/userSlice";
import jwtDecode from "jwt-decode";
import { Container, Row, Col } from "react-bootstrap";
import { houseKeepingType } from "./voter_page_components/housekeeping";
import BillsWrapper from "./voter_page_components/billsWrapper";

function VoterPage() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  const [message, setMessage] = useState({ type: "alert alert-", msg: "" });
  const [token, setToken] = useState("");
  const [action, setAction] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const circleMembers = useSelector((state) => state.AuthUser.circleMembers);
  const [delegate, setDelegate] = useState({});
  let date = new Date(AuthUser.date_joined);

  // set the delegate on render
  useEffect(() => {
    setDelegate(circleMembers?.filter((e) => e.is_delegate === true)[0]);
  }, [circleMembers]);

  // get the new access token on each page load or redirect
  useEffect(() => {
    const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
    const token_params = { refresh: AuthUser.token.refresh };
    axios
      .post(TokenUrl, token_params)
      .then((response) => {
        if (response.status === 200) {
          // set the new access token and which btn is clicked via clicked const.
          setToken(response.data.access);
          let u = { ...AuthUser };
          u.token = {
            refresh: AuthUser.token.refresh,
            access: response.data.access,
          };
          dispatch(authenticate(u));
          setAction("userinfo");
        } else {
          setMessage({
            type: "alert alert-danger",
            msg: "could not get access token",
          });
        }
      })
      .catch((error) => {
        setMessage({
          type: "alert alert-danger",
          msg: "something went wrong with your request",
        });
        // setErr("Something went wrong. Check your inputs and try again.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (action) {
      // if no action is specified, fetch user info and circle
      case "userinfo":
        if (AuthUser.token.access.length > 0) {
          const url = `${window.location.protocol}//${baseURL}/api/userinfo/`;
          const params = { user: AuthUser.username };
          let header = { Authorization: `Bearer ${AuthUser.token.access}` };
          axios
            .post(url, params, { headers: header })
            .then((response) => {
              if (response.status === 200) {
                let token = AuthUser.token;
                dispatch(authenticate({ ...response.data.user, token }));
                if (response.data.user.users.userType === 1) {
                  dispatch(circle(response.data.circle));
                }
              } else {
                setMessage({
                  type: "alert alert-danger",
                  msg: "could not get user info and circle",
                });
              }
            })
            .catch((error) => {
              console.log("error on fetching user and circle info:", error);
            });
        }
        break;
      case "joinPd":
        console.log("joining a circle here");
        break;
      case "createCircle":
        console.log("creating a circle");
        if (token.length > 0) {
          let header = { Authorization: `Bearer ${token}` };
          const url = `${window.location.protocol}//${baseURL}/api/create-circle/`;
          const param = {
            user: AuthUser.username,
            district: AuthUser.users.district.code,
          };
          axios
            .post(url, param, { headers: header })
            .then((response) => {
              if (response.status === 400) {
                setMessage({
                  msg: response.data.message,
                  type: "alert alert-danger",
                });
              } else if (response.status === 200) {
                dispatch(circle(response.data));
                let u = { ...AuthUser };
                u.userType = 1;
                dispatch(authenticate(u));
                setMessage({
                  type: "alert alert-success",
                  msg: "circle created.",
                });
                // nagivate to voter page...
                navigate("/house-keeping-page");
              } else {
                console.log("something went wrong:", response);
              }
            })
            .catch((error) => {
              console.log("err: ", error);
              setMessage({
                msg: error.response?.data?.message,
                type: "alert alert-danger",
              });
            });
        }
        break;
      default:
        console.log("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  useEffect(() => {
    const isTokenExpired = () => {
      const decodedToken = jwtDecode(AuthUser.token.refresh);
      return decodedToken.exp < Date.now() / 1000;
    };

    if (isTokenExpired()) {
      navigate("/enter-the-floor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get the detials of f_link if the f_link (sec_del) state is not found
  useEffect(() => {
    if (sec_del.code === undefined && AuthUser?.users?.userType === 2) {
      // get the f_link details.
      let header = { Authorization: `Bearer ${AuthUser.token.access}` };
      const url = `${window.location.protocol}//${baseURL}/api/second-delegate/get_f_link_by_user/`;
      const param = {
        user: AuthUser.username,
      };

      axios
        .post(url, param, { headers: header })
        .then((response) => {
          console.log("get the f link: ", response.data);
          dispatch(sec_del(response.data));
        })
        .catch((error) => {
          console.log("error getting f_link details...:", error);
        });
    }
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {message?.msg ? (
            <div className={message?.type} role="alert">
              {message?.msg}
            </div>
          ) : (
            ""
          )}

          {AuthUser?.users?.is_reg ? (
            <div className="alert alert-warning mt-3">
              <p>
                You have to got until
                <span className="text-danger">{date.toDateString()}</span> to
                registered to vote in your district or your account will be
                deleted! Yikes!
                <a href="/"> Learn More</a>.
              </p>
              <p>
                But, if you have gotten registered since the last time you
                entered the floor,
                <a href="/"> click here</a>.
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <Container style={{ marginTop: "2%" }}>
        <div className="row text-center ">
          <h1>Voter Page</h1>
        </div>
        <Row className="">
          <Col className="">
            <Row>
              <Col xs="auto">
                <p className="text-left">Voter Name:</p>
              </Col>
              <Col>
                <p>{AuthUser?.users?.legalName}</p>
              </Col>
            </Row>
          </Col>
          <Col>
            <p className="text-center">
              Verification Score: {AuthUser?.users?.verificationScore}/7
            </p>
          </Col>
          <Col>
            <Row>
              <Col xs="auto">
                <p className="text-left">District:</p>
              </Col>
              <Col>
                <p>{AuthUser.users?.district?.code}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* the three columns on  kyle note: fix to center the below when on mobile*/}

      <div className="row d-flex justify-content-center align-items-center mt-2">
        <div className="col-sm-12 col-md-4 d-flex justify-content-center text-lg-start text-center text-md-start">
          <ul className="list-unstyled">
            {/* {(AuthUser?.users?.userType != 0) ? <li className="mb-2"><Link to={'/voter-page'}>List of Delegates</Link></li>:""} */}
            {AuthUser?.users?.userType !== 0 ? (
              <li className="mb-2">
                <Link to={"/circle-back-n-forth"}> Back-and-Forth </Link>
              </li>
            ) : (
              ""
            )}
            {AuthUser?.users?.userType !== 0 ? (
              <li className="mb-2">
                <Link to={"/member-contact"}> Member Contact Page </Link>
              </li>
            ) : (
              ""
            )}
            {AuthUser?.users?.userType !== 0 ? (
              <li className="mb-2">
                <Link to={"/house-keeping-page"}>
                  Circle Housekeeping Page{" "}
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        <div className="col-sm-12 col-md-4 d-flex justify-content-center">
          {houseKeepingType(AuthUser, delegate, setAction)}
        </div>
        <div className="col-sm-12 col-md-4 d-flex justify-content-center text-lg-start text-center text-md-start">
          <ul className="list-unstyled">
            {AuthUser?.users?.userType !== 0 ? (
              <>
                {/* <li className="mb-2"><Link to={'/meeting-schedule'}> First Link Meeting Schedule </Link></li> */}
                <li className="mb-2">
                  <Link to={"/meetings-and-minutes"}> Meetings & Minutes </Link>
                </li>
                {/* <li className="mb-2"><Link to={'/voter-page'}> Bill Metrics </Link></li> */}
                <li className="mb-2">
                  <Link to={"/voter-page"}> Voter Settings </Link>
                </li>
              </>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>

      <BillsWrapper setMessage={() => setMessage()} />
    </div>
  );
}
export default VoterPage;
