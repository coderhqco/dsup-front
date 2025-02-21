import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import Member from "./member.jsx";
import Candidate from "./candidate.jsx";

import Status from "./status_message.jsx";

function SecondDelegatePage() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  const first_link = useSelector((state) => state.AuthUser.sec_del);
  const [err, setErr] = useState("");
  const [connectionErr, setConnectionErr] = useState(null);

  /** We have fDEl object which contains the details of FDel.
   * Iam_delegate is true if the auth user is a delegate.
   * Iam_member is true of the auth user is a member
   */
  const [fDel, setFDel] = useState("");
  const [Iam_delegate, setIam_delegate] = useState(false);
  const [Iam_member, setIam_member] = useState(false);
  const [dissolve, setDissolve] = useState(false);
  const [candidate, setCandidate] = useState("");
  const [members, setMembers] = useState("");
  const [Iam_candidate, setIam_candidate] = useState(false);

  let ws_schame = window.location.protocol === "https:" ? "wss" : "ws";
  const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/sec-del/${first_link?.code}/${AuthUser.username}`;
  const chatSocket = new WebSocket(url);

  useEffect(() => {
    // on each member change, check if the Circle has one member.
    if (members.length <= 1 && candidate.length === 0) {
      setDissolve(true);
    } else {
      setDissolve(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate, members]);

  // Function to update the error state and schedule the reset
  useEffect(() => {
    // Schedule the reset after 5000 milliseconds (5 seconds)
    setTimeout(() => {
      setErr("");
    }, 10000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [err]);

  const action_lists = (msg) => {
    // add the members and candidates on their states.
    if (msg.action === "member_listing") {
      if (msg.member_list) {
        // set the members and candidates
        // setSec_del(msg.member_list[0]?.first_link);
        const membersList = msg.member_list.filter(
          (member) => member.is_member
        );
        const candidatesList = msg.member_list.filter(
          (member) => !member.is_member
        );

        setMembers(membersList);
        setCandidate(candidatesList);
        if (
          membersList.some(
            (member) => member?.user?.username === AuthUser?.username
          )
        ) {
          setIam_delegate(true);
          console.log("I am delegate: ", Iam_delegate);
        } else {
          setIam_member(true);
          console.log("I am member: ", Iam_member);
        }

        if (
          candidatesList.some(
            (candidate) => candidate?.user.username === AuthUser?.username
          )
        ) {
          setIam_candidate(true);
          console.log("I am candidate: ", Iam_candidate);
        } else {
          console.log("I am not a candidate.");
        }
      }

      //   other actions here
    }
  };

  //   connect to websocket on load and get data
  useEffect(() => {
    /** This is the functions that receives all the messages from server */
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      /**
       * all the messages that comes from this end point is the same.
       * it contains members
       */
      action_lists(data);
    };

    // what happens on closing the connection
    chatSocket.onclose = (e) => {
      setConnectionErr("live connection is closed. Please refresh your page!");
    };

    // close the connection on page leave. cleanup function
    return () => {
      /**
       * 1. close the connection
       * 2. clear the states
       * 3. terminate any functions in running or in background
       */
      setMembers("");
      setCandidate("");
      clearTimeout();
      setFDel("");
      // return () => { clearTimeout(resetTimeout); };
      console.log("closing the connection");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update or change the circle invitation key
  const invitationKey = () => {
    chatSocket.send(
      JSON.stringify({
        action: "invitationKey",
        payload: { circle: first_link.code },
      })
    );
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-3"></div>
        <div className="col-sm-12 col-md-6 mt-3">
          <div className="row">
            {err ? (
              <div className="alert alert-danger" role="alert">
                {err}
              </div>
            ) : null}
            {connectionErr ? (
              <div className="alert alert-danger" role="alert">
                {connectionErr}
              </div>
            ) : null}
          </div>
          <h1 className="text-center">Housekeeping Page</h1>
          <h3 className="text-center">
            First Link No: {first_link?.code} &nbsp;&nbsp; District:
            {first_link?.district.code}
          </h3>
          <h4 className="text-center">
            Invitation Key: {first_link?.invitation_key}
          </h4>

          {fDel?.user?.username === AuthUser?.username ? (
            <button
              className="d-block mx-auto my-2 btn btn-success text-center"
              onClick={() => invitationKey()}>
              Generate new key
            </button>
          ) : null}

          {first_link?.is_active ? (
            <p className="text-center">Circle Status: ACTIVE!</p>
          ) : null}
        </div>
        <div className="col-sm-12 col-md-3"></div>
      </div>
      <div className="row">
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th className="fw-bold">#</th>
              <th className="fw-bold">Mamber Name</th>
              {first_link?.is_active ? (
                <>
                  <th className="fw-bold">Put forward as First Delegate</th>
                </>
              ) : null}
              {Iam_delegate ? (
                <th className="fw-bold">
                  {dissolve === true
                    ? "Dissolve First Link? "
                    : "Remove Member"}
                </th>
              ) : (
                <th></th>
              )}
            </tr>
          </thead>
          <tbody>
            {/**
             * It will always be 1 at least.
             * first check if the members is greater than 0.
             *  */}
            {members?.length > 0
              ? members?.map((member, index) => (
                  <Member
                    key={index}
                    dissolve={dissolve}
                    index={index}
                    circleInfo={first_link}
                    member={member}
                    chatSocket={chatSocket}
                    err={err}
                    Iam_member={Iam_member}
                    Iam_delegate={Iam_delegate}
                  />
                ))
              : null}
          </tbody>
        </table>

        {/* candidate list table */}
        <p className="py-0 my-0 mt-2">Candidate(s) awaiting votes...</p>
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th className="fw-bold">#</th>
              <th className="fw-bold">Candidate Name</th>
              {Iam_delegate || Iam_member ? (
                <th className="fw-bold">
                  Do you want this candidate to be a member?
                </th>
              ) : null}
              {Iam_delegate ? (
                <th className="fw-bold">Remove Candidate</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {/**
             * check if the candidate list is greater than 0
             *
             */}
            {candidate?.length > 0 ? (
              candidate?.map((cand, index) => (
                <Candidate
                  chatSocket={chatSocket}
                  key={index}
                  index={index}
                  Iam_member={Iam_member}
                  Iam_delegate={Iam_delegate}
                  candidate={cand}
                  fDel={fDel}></Candidate>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No Candidates
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* status messages */}
      <Status
        Iam_delegate={Iam_delegate}
        Iam_member={Iam_member}
        Iam_candidate={Iam_candidate}
        circleInfo={first_link}
        candidate={candidate}
        members={members}></Status>
    </div>
  );
}

export default SecondDelegatePage;
