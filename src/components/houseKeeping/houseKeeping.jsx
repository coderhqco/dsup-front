import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  authenticate,
  circle,
  addCirclemMembers,
  desolveCircle,
} from "../../store/userSlice.js";
import Member from "./member.jsx";

function HouseKeeping() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  const circleInfo = useSelector((state) => state.AuthUser.circle);
  const circleMembers = useSelector((state) => state.AuthUser.circleMembers);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // saparetes the candidates and members
  const [candidate, setCandidate] = useState("");
  const [members, setMembers] = useState("");

  // for models to show and close
  const [showModel, setShowModel] = useState(false);
  const [modelContent, setModelContent] = useState("");
  const handleModelClose = () => setShowModel(false);
  const [act, setAct] = useState(null);
  const [removeMember, setRemoveMember] = useState(null);
  const [err, setErr] = useState("");
  const [is_candidate, setIs_candidate] = useState(false);
  // let Is_delegate = false
  const [Is_delegate, setIs_delegate] = useState(false);

  // saperate candidates on each page load or circlemembers changes
  useEffect(() => {
    setMembers(circleMembers?.filter((member) => member.is_member));
    setCandidate(circleMembers?.filter((member) => !member.is_member));
  }, [circleMembers]);

  // on each candidate change, check the logged in user if they are candidate only for this Circle.
  useEffect(() => {
    if (candidate) {
      candidate.map((candidate) => {
        if (candidate.user.username === AuthUser.username) {
          setIs_candidate(true);
        }
      });
    }
  }, [candidate, members]);

  let ws_schame = window.location.protocol === "https:" ? "wss" : "ws";
  const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/circle/${circleInfo?.code}/${AuthUser.username}/`;
  const chatSocket = new WebSocket(url);

  useEffect(() => {
    // get back the messages...
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      if (data.type) {
        switch (data.type) {
          case "circlemember":
            dispatch(addCirclemMembers(data.data.circleMembers));
            dispatch(circle(data.data.circle));
            break;
          case "circleInvitationKey":
            dispatch(circle(data.data.data));
            break;
          case "joined":
            dispatch(addCirclemMembers(data.data.data));
            break;
          case "voteIn":
            if (data.data.done && data.data.is_member) {
              dispatch(addCirclemMembers(data.data.data.circlemembers));
              dispatch(circle(data.data.data.circle));
            } else if (!data.data.is_member && data.data.done) {
              dispatch(addCirclemMembers(data.data.data));
            } else if (!data.data.done) {
              // show only to the user that clicked.
              if (data.data.voter == AuthUser.username) {
                alert(data.data.data);
              }
            }
            break;
          case "voteOut":
            if (!data.data.done) {
              alert(data.data.data);
            } else if (data.data.done) {
              // add data to state
              dispatch(addCirclemMembers(data.data.data));
            }
            break;
          case "delegate":
            if (!data.data.done) {
              alert(data.data.data);
            } else if (data.data.done) {
              dispatch(addCirclemMembers(data.data.data));
            }

            break;
          case "desolveCircle":
            if (data.data.done) {
              dispatch(desolveCircle());
              // set the userType to 0 and reset AuthUser
              let u = { ...AuthUser };
              u.userType = 0;
              dispatch(authenticate(u));
              // navigate back to voter page
              navigate("/voter-page");
            }
            break;
          case "removemember":
            dispatch(addCirclemMembers(data.data.data.circleMembers));
            dispatch(circle(data.data.data.circle));
            setShowModel(false);
            // check if the data.data.done is the username of the logged in user
            if (data.data.done === AuthUser.username) {
              let u = { ...AuthUser };
              u.userType = 0;
              dispatch(authenticate(u));
              // navigate back to voter page
              navigate("/voter-page");
            }
            break;
          case "chat_message":
            console.log(data);
            break;
          default:
            console.log("no action: no case...");
            break;
        }
      } //end of if(data.type)
    };

    // what happens on closing the connection
    chatSocket.onclose = function (e) {
      setErr("live connection is closed. Please refresh your page or revisit!");
      console.log("chat socket closed...");
    };
  }, []);

  // handing the changing of the circle key invitation
  const handleChngInvtKey = () => {
    chatSocket.send(
      JSON.stringify({
        type: "circleInvitationKey",
        circle: circleInfo.code,
      })
    );
  };

  // this handles the voting process for a candidate.
  const handleVoteIn = (e) => {
    chatSocket.send(
      JSON.stringify({
        type: "voteIn",
        circle: circleInfo.code,
        voter: AuthUser.username,
        candidate: e.target.value,
      })
    );
  };

  // check if the user logged in is delegate.
  useEffect(() => {
    if (members) {
      if (
        members[0]?.user.username === AuthUser?.username &&
        members[0].is_delegate
      ) {
        setIs_delegate(true);
      } else {
        setIs_delegate(false);
      }
    }
  }, [members]);

  // removing the circle permemently.
  const handleDesolve = () => {
    chatSocket.send(
      JSON.stringify({
        type: "desolveCircle",
        circle: circleInfo.code,
        user: AuthUser.username,
      })
    );
  };
  const handleRemove = () => {
    chatSocket.send(
      JSON.stringify({
        type: "removemember",
        circle: circleInfo.code,
        member: removeMember,
        user: AuthUser.username,
      })
    );
    // setShowModel(false)
  };

  // check if the circle should be desolved
  const handleModelShow = (param, member) => {
    switch (param) {
      case "dessolveCircle":
        setModelContent(
          `This action will dissolve this Circle permanently, do you want to proceed?`
        );
        setAct("dessolveCircle");
        setShowModel(true);
        break;
      case "removemember":
        setModelContent(
          `Checking this box will remove this Member Candidate from the list. Proceed?`
        );
        setAct("removem");
        setRemoveMember(member);
        setShowModel(true);
        break;
      case "voteIn":
        // this case is not implemented yet.
        setModelContent(
          `Checking this box will make ${candidate[0]?.user.users.legalName} a member of this Circle.`
        );
        setAct("voteIn");
        setShowModel(true);
        break;
      case "voteOut":
        setModelContent(`Unchecking ‘Yes’ means you want to vote this member out. If a simple majority of existing
                members vote a member out, they are removed from the group. Are you sure you want to vote
                this member out?`);
        setAct("voteOut");
        setRemoveMember(member);
        setShowModel(true);
        break;
      default:
        console.log("no case in handle show model");
        break;
    }
  };

  const actions = (member) => {
    // check if the circle is active or not
    if (!circleInfo?.is_active) {
      // check is the logged in user is delegate
      if (Is_delegate) {
        // check if the circlemember is one
        if (circleMembers?.length === 1) {
          return (
            <>
              {" "}
              <span>
                Dissolve Circle
                <input
                  className="mx-2 form-check-input"
                  type="checkbox"
                  onChange={() => handleModelShow("dessolveCircle", "")}
                  checked={showModel}
                />
              </span>{" "}
            </>
          );
        } else {
          // if the circlemember is one one and logged in user is a delegate; then remove the member
          if (member?.is_delegate) {
            return "";
          } else {
            return (
              <>
                {" "}
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={showModel}
                  onChange={() => handleModelShow("removemember", member?.id)}
                />
              </>
            );
          }
          return "";
        } //end of circlememeber being one
      } else {
        // check if user is this member
        if (member.user.username === AuthUser.username) {
          return (
            <>
              Would you like to remain in this Circle?
              <input
                type="checkbox"
                className="form-check-input mx-2"
                checked={true}
                onChange={() => handleModelShow("removemember", member?.id)}
              />
            </>
          );
        } else {
          return "";
        }
      } //endof is_delegate
    } else {
      if (member.voteOuts.length > members.length / 2 && Is_delegate) {
        return (
          <>
            {" "}
            majarity has voted him/her out. Would you remove him/her?
            <input
              type="checkbox"
              className="form-check-input mx-2"
              checked={showModel}
              onChange={() => handleModelShow("removemember", member)}
            />
          </>
        );
      } else {
        return "";
      }
    } //endof circle active
  };

  const handleVoteOut = (member) => {
    // params required : member, voter , circle
    chatSocket.send(
      JSON.stringify({
        type: "voteOut",
        circle: circleInfo.code,
        member: member?.id,
        voter: AuthUser.username,
      })
    );
    setShowModel(false);
  };

  const handleDelegate = (member) => {
    chatSocket.send(
      JSON.stringify({
        type: "delegate",
        circle: circleInfo.code,
        recipient: member?.id,
        voter: AuthUser.username,
      })
    );
  };

  const voteInsChck = (voteIns) => {
    const vtrs = [];
    voteIns.map((i) => vtrs.push(i.substring(0, 5)));
    return !vtrs.includes(AuthUser.username);
  };

  const delegated = (putF) => {
    const puts = [];
    putF.map((i) => puts.push(i.substring(0, 5)));
    return puts.includes(AuthUser.username);
  };

  return (
    <div className="container">
      <Modal
        show={showModel}
        onHide={() => handleModelClose()}
        backdrop="static"
        keyboard={false}>
        <Modal.Body> {modelContent} </Modal.Body>
        <Modal.Footer>
          {act === "dessolveCircle" ? (
            <>
              <Button variant="danger" onClick={() => handleDesolve()}>
                {" "}
                Yes{" "}
              </Button>
              <Button variant="secondary" onClick={() => setShowModel(false)}>
                {" "}
                No{" "}
              </Button>
            </>
          ) : (
            ""
          )}
          {act === "removem" ? (
            <>
              <Button variant="danger" onClick={() => handleRemove()}>
                {" "}
                proceed{" "}
              </Button>
              <Button variant="secondary" onClick={() => setShowModel(false)}>
                {" "}
                Cancel{" "}
              </Button>
            </>
          ) : (
            ""
          )}
          {act === "voteOut" ? (
            <>
              <Button
                variant="danger"
                onClick={() => handleVoteOut(removeMember)}>
                {" "}
                Yes{" "}
              </Button>
              <Button variant="secondary" onClick={() => setShowModel(false)}>
                {" "}
                No{" "}
              </Button>
            </>
          ) : (
            ""
          )}
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div className="col-sm-12 col-md-3"></div>
        <div className="col-sm-12 col-md-6 mt-3">
          <div className="row">
            {err ? (
              <div className="alert alert-danger" role="alert">
                {err}{" "}
              </div>
            ) : null}
          </div>
          <h1 className="text-center">Housekeeping Page</h1>

          <h3 className="text-center">
            Circle: {circleInfo?.code} District: {circleInfo?.district.code}
          </h3>

          <h4 className="text-center">
            Invitation Key: {circleInfo?.invitation_code}
          </h4>
          {Is_delegate ? (
            <button
              className="d-block mx-auto my-2 btn btn-success text-center"
              onClick={handleChngInvtKey}>
              Generate new key
            </button>
          ) : null}
          {circleInfo?.is_active ? (
            <p className="text-center">Circle Status: ACTIVE!</p>
          ) : null}
        </div>
        <div className="col-sm-12 col-md-3"></div>
      </div>
      <div className="row">
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th>#</th>
              <th>Member Name</th>
              <th>Do you want this voter to be a member?</th>
              <th>
                {circleInfo?.is_active ? "Total Vote Out" : "Total Voted"}{" "}
              </th>
              {/* if the Circle is not active, do not show these two column */}
              {circleInfo?.is_active ? (
                <>
                  <th>Put forward as First Delegate</th>
                  <th>Total</th>
                </>
              ) : (
                ""
              )}
              <th>Remove Member</th>
            </tr>
          </thead>
          <tbody>
            {members?.length > 0
              ? members?.map((member, index) => (
                  <tr key={index} className="border">
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>
                      {member?.user.users.legalName}{" "}
                      {member.is_delegate ? (
                        <span className="badge bg-primary">F-Del</span>
                      ) : null}{" "}
                    </td>
                    <td>
                      {circleInfo?.is_active ? (
                        <>
                          Yes
                          <input
                            type="checkbox"
                            className="form-check-input mx-2"
                            checked={voteInsChck(member?.voteOuts)}
                            onChange={() => handleModelShow("voteOut", member)}
                          />
                        </>
                      ) : null}
                    </td>

                    {/* do not show below columns if the circle is not active */}
                    {circleInfo?.is_active ? (
                      <>
                        <td>
                          {Is_delegate
                            ? circleInfo?.is_active
                              ? member.voteOuts.length === 0
                                ? ""
                                : member.voteOuts.length
                              : null
                            : null}
                        </td>

                        <td>
                          Yes
                          <input
                            type="checkbox"
                            className="form-check-input mx-2"
                            checked={delegated(member?.putForward)}
                            onChange={() => handleDelegate(member)}
                          />
                        </td>
                      </>
                    ) : (
                      ""
                    )}
                    {/* end circle active condition */}

                    <td>
                      {circleInfo?.is_active
                        ? member.putForward.length === 0
                          ? ""
                          : member.putForward.length
                        : null}
                    </td>
                    <td>{actions(member)}</td>
                  </tr>
                ))
              : ""}

            {candidate?.length > 0 ? (
              <tr>
                <td>01</td>
                <td>{candidate[0]?.user.users.legalName}</td>
                <td>
                  {is_candidate ? (
                    ""
                  ) : (
                    <div>
                      Yes
                      <input
                        type="checkbox"
                        className="form-check-input mx-2"
                        value={candidate[0]?.id}
                        checked={!voteInsChck(candidate[0]?.voteIns)}
                        onChange={(e) => handleVoteIn(e)}
                      />
                    </div>
                  )}
                </td>
                <td> {candidate[0]?.voteIns.length} </td>
                {/* if Circle is not active, do not show these two column */}
                {circleInfo?.is_active ? (
                  <>
                    <td></td> <td></td>
                  </>
                ) : (
                  ""
                )}

                <td>
                  {Is_delegate ? (
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={showModel}
                      onChange={() =>
                        handleModelShow("removemember", candidate[0].id)
                      }
                    />
                  ) : null}
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </div>

      {/* message status area */}
      <div className="row border p-3 shadow-sm">
        <p>
          <strong>Status: </strong>
          {circleInfo?.is_active
            ? "This Circle is active!"
            : "This Circle will become active when it has six members."}
        </p>
        {Is_delegate ? (
          <>
            {candidate?.length === 0 ? (
              <p>
                There are no Member Candidates. Invite voters in your district
                to join by giving them a Circle Invitation Key.
              </p>
            ) : (
              <p>
                There is a Member Candidate awaiting a majority vote of existing
                members.
              </p>
            )}
            {members?.length >= 3 ? (
              ""
            ) : (
              <>
                <p>Once you generate a new key, the old one will not work.</p>
                <p>
                  The creator of this Circle has been automatically made First
                  Delegate. To elect a different First Delegate, hold an
                  election. Elections can be held when you have six or more
                  members.{" "}
                </p>
                <p>
                  Only the F-Del can dissolve a Circle, and may only do so when
                  they are the only member left.
                </p>
              </>
            )}{" "}
          </>
        ) : // check if the user is member or candidate
        // this check is for candidate throughing undefined exception
        candidate !== undefined ? (
          is_candidate ? (
            <>
              <p>
                {" "}
                You are a Member Candidate awaiting a majority vote of existing
                members.
              </p>
              <p>
                {" "}
                You can wait to see if you are voted in, or you can contact the
                F-Del of this Circle IRL to discuss being voted in.
              </p>
              <p>
                {" "}
                If you shouldn’t be trying to join this Circle for any reason,
                the F-Del can remove you as a member candidate. After that
                happens, you will not be able to attempt to join this Circle
                unless you are given a new Invitation Key. Ask your F-Del IRL.
              </p>
              <p>
                {" "}
                The creator of this Circle has been automatically made First
                Delegate. To elect a different First Delegate, your Circle can
                hold an election. Elections can be held when you have six or
                more members.
              </p>
              <p>
                Only the F-Del can dissolve a Circle, and may only do so when
                they are the only member left.
              </p>
            </>
          ) : (
            <>
              <p>You are a member of the Circle.</p>
              {candidate[0] ? (
                <p>
                  {" "}
                  There is a Member Candidate awaiting a majority vote of
                  existing members. Check the Yes box next to their name to vote
                  them in. A running total of member votes for this candidate
                  will appear in the Total column. When a Candidate receives a
                  majority of the votes of existing members, they will
                  automatically become a Member, and the voting will be
                  ‘forgotten’ by the database.{" "}
                </p>
              ) : (
                ""
              )}
              <p>
                If you want someone to join this Circle, give them the CIK. Make
                sure it is the most recent (currently valid) CIK generated by
                the F-Del. If you encounter any problems, please contact the
                F-Del In Real Life, or ElseWhere On The Internet.
              </p>
              <p>
                Until this Circle becomes active, you can be removed by the
                F-Del at any time.{" "}
              </p>
              <span>
                After this Circle becomes active, you can only be removed by:
                <ol>
                  <li>
                    {" "}
                    Unchecking the Yes box next to ‘Would you like to remain in
                    this Circle’{" "}
                  </li>
                  <li> Being voted out by a majority of existing members. </li>
                </ol>
              </span>
              <p>
                Once a member is removed from a specific Circle, they cannot
                attempt to rejoin it without a new Circle Invitation Key.
              </p>
              <p>
                The creator of this Circle has been automatically made First
                Delegate. To elect a different First Delegate, your Circle can
                hold an election. Elections can be held when you have six or
                more members.
              </p>
              <p>
                Only the F-Del can dissolve a Circle, and may only do so when
                they are the only member left.
              </p>
            </>
          )
        ) : (
          ""
        )}
      </div>

      {/* helper links for delegate */}
      {Is_delegate ? (
        <div className="row">
          <strong>Learn about:</strong>
          <Link className="mx-3 text-secondary" to="/house-keeping-page">
            Active vs inactive Circle.
          </Link>
          <Link className="mx-3 text-secondary" to="/house-keeping-page">
            How to invite new members.
          </Link>
          <Link className="mx-3 text-secondary" to="/house-keeping-page">
            How to hold a First Delegate Election.
          </Link>
          <Link className="mx-3 text-secondary" to="/house-keeping-page">
            How to dissolve a Circle.
          </Link>
        </div>
      ) : // helping links for circle members
      // this check is for candidate throughing undefined exception
      candidate !== undefined ? (
        AuthUser.username === candidate[0]?.user.username ? null : (
          <div className="row">
            <strong>Learn about:</strong>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Invite someone to join this Circle.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Being removed from this Circle.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Elect a new first Delegate.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Circle Dessolution.
            </Link>
          </div>
        )
      ) : (
        ""
      )}
    </div>
  );
}

export default HouseKeeping;
