import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { circle, authenticate, sec_del } from "../../store/userSlice.js";
import { baseURL } from "../../store/conf.js";

function JoinSecDel() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  const [inviteKey, setInviteKey] = useState("");
  const [message, setMessage] = useState({ type: "alert alert-", msg: "" });
  const [token, setToken] = useState("");
  const [CIRCLE, setCIRCLE] = useState("");
  const [WS, setWS] = useState({});
  const [clicked, setClicked] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // we need invitation key and username. token is required for request
    // after the joint, we have to redirect to the circle page
    if (clicked === "create_sec_del") {
      console.log("creating first link and adding the member...");
      if (token.length > 0) {
        // console.log("ceating a circle...")
        // constructing to request to create the first link
        let header = { Authorization: `Bearer ${token}` };
        const url = `${window.location.protocol}//${baseURL}/api/second-delegate/`;
        const param = {
          user: AuthUser.username,
          district: AuthUser.users.district.code,
        };

        axios
          .post(url, param, { headers: header })
          .then((response) => {
            console.log("res: ", response);
            if (response.status === 400) {
              setMessage({
                msg: response.data.message,
                type: "alert alert-danger",
              });
            } else if (response.status === 200) {
              // if the request was a succcess, set the sec_del state so that we need it in the next page (sec_del housekeeping page)
              dispatch(sec_del(response.data));

              // set the userType to 2 without requesting new data from the server.
              let u = { ...AuthUser.users };
              let userType = 2;
              let users = { ...u, userType };
              dispatch(authenticate({ ...AuthUser, users }));
              setMessage({
                type: "alert alert-success",
                msg: "sec del created.",
              });

              //   after successfull operation of creating, settign datas and users, take the voter to first link page
              navigate("/first-link-page");
            } else {
              console.log("something went wrong:", response);
            }
          })
          .catch((error) => {
            setMessage({
              msg: error.response?.data?.message,
              type: "alert alert-danger",
            });
          });
      }
    } else if (clicked === "join") {
      // console.log("joining a circle ...")
      if (token.length > 0 && inviteKey.length === 10) {
        let header = { Authorization: `Bearer ${token}` };
        const url = `${window.location.protocol}//${baseURL}/api/join-circle/`;
        const param = { user: AuthUser.username, circle: inviteKey };

        axios
          .post(url, param, { headers: header })
          .then((response) => {
            if (response.status === 400) {
              setMessage({
                msg: response.data.message,
                type: "alert alert-danger",
              });
            } else if (response.status === 200) {
              // set the user and create a store for circle
              dispatch(circle(response.data));
              let u = { ...AuthUser.users };
              let userType = 1;
              let users = { ...u, userType };
              dispatch(authenticate({ ...AuthUser, users }));
              setMessage({
                type: "alert alert-success",
                msg: "Joint the circle. wait for the members to aprove you. Redirecting to Circle...",
              });

              setCIRCLE(response.data.code);
            } else {
              console.log("something went wrong:", response);
            }
          })
          .catch((error) => {
            console.log("err: ", error);
            setMessage({
              msg: error.response.data.message,
              type: "alert alert-danger",
            });
          });
      }

      //   setMessage({
      //     type: "alert alert-danger",
      //     msg: "invalid invitation key",
      //   });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (CIRCLE.length > 1) {
      let ws_schame = window.location.protocol === "https:" ? "wss" : "ws";
      const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/sec-del/${CIRCLE}/${AuthUser.username}/`;
      const chatSocket = new WebSocket(url);
      // get back the messages...
      chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.type === "circlemember") {
          console.log(data.data);
        } else if (data.type === "joined") {
          console.log("joined: ", data.data);
        }
        setWS(chatSocket);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CIRCLE]);

  useEffect(() => {
    if (WS.url) {
      WS.send(
        JSON.stringify({
          action: "join",
          payload: {
            voter: AuthUser.username,
            circle: CIRCLE,
          },
        })
      );
      WS.close();
      navigate("/house-keeping-page");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WS]);

  function GetToken(action) {
    // from is tell weather the join btn is clicked on create circle
    const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
    const token_params = { refresh: AuthUser.token.refresh };
    axios
      .post(TokenUrl, token_params)
      .then((response) => {
        if (response.status === 200) {
          // set the new access token and which btn is clicked via clicked const.
          setToken(response.data.access);
          setClicked(action);
          // console.log("token is set to a new token",from)
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
        console.log(error);
      });
  }

  const handleSubmit = () => {
    // get the access token and set the clicked to join
    GetToken("join");
  };
  const handleCircle = () => {
    GetToken("create_sec_del");
    // we need username and district code. token is required for request
    // after the creation of circle, we have to redirect to circle page
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-3"></div>
        <div className="col-sm-12 col-md-6 mt-3">
          <h1 className="text-center">Join A First Link {AuthUser.userType}</h1>
          <div className="">
            <h4 className="text-left">
              You must have an Invitation Key to join a First Link.
            </h4>
            <p className="text-left">
              The First Delegate of a Sec-Del should send you an Invitation Key.
              This cannot be done via the website.
            </p>
            <p className="text-left">
              Or you can create your own First Link and start inviting others to
              join it.
            </p>
            <div className="col text-center">
              <span
                onClick={handleCircle}
                className="btn btn-primary btn-sm mb-3">
                Create A First Link
              </span>
            </div>
          </div>

          {message.msg ? (
            <div className={message.type} role="alert">
              {" "}
              {message.msg}
            </div>
          ) : (
            ""
          )}

          <label className="text-left">invitation Key</label>
          <input
            type="text"
            onChange={(e) => setInviteKey(e.target.value)}
            className="form-control"
            placeholder="Enter the first link invitation key here"
          />
          <div className="col text-center">
            <button className="btn btn-success mt-2" onClick={handleSubmit}>
              {" "}
              Join The First Link
            </button>
          </div>
        </div>
        <div className="col-sm-12 col-md-3"></div>
      </div>
    </div>
  );
}

export default JoinSecDel;
