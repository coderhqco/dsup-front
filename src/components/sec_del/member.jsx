import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
// import axios from "axios";
// import { baseURL } from "../../store/conf";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function Member({
  member,
  index,
  chatSocket,
  dissolve,
  err,
  circleInfo,
  Iam_delegate,
}) {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  const [voted_out, setVoted_out] = useState(false);
  const [put_forward, setPut_forward] = useState(false);
  const [clicked, setClicked] = useState(false); //check the member that clicked

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = () => {
    // Open the modal when the input value changes
    setShowModal(true);
  };

  //   if there is any error, hide the model show
  useEffect(() => {
    setShowModal(false);
  }, [err]);

  const handleCloseModal = () => {
    // Close the modal without performing the action
    setShowModal(false);
  };

  const removeMember = () => {
    /** send the vote to the server */
    chatSocket.send(
      JSON.stringify({
        action: "remove_candidate",
        candidate: member.id,
      })
    );
  };

  const voteOut = () => {
    /** send the vote to the server */
    chatSocket.send(
      JSON.stringify({
        action: "vote_out",
        payload: {
          voter: AuthUser.username,
          member: member?.id,
        },
      })
    );
  };

  const removeCircle = () => {
    /** send the vote to the server */
    chatSocket.send(
      JSON.stringify({
        action: "dissolve",
        payload: {
          voter: AuthUser.username,
          member: member?.id,
        },
      })
    );
  };

  const putForward = () => {
    /** send the vote to the server */
    chatSocket.send(
      JSON.stringify({
        action: "putForward",
        payload: {
          voter: AuthUser.username,
          member: member?.id,
        },
      })
    );
    setClicked(!clicked);
  };

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>
          {" "}
          {member?.user?.users?.legalName}
          {member?.is_delegate ? (
            <span className="alert alert-success p-0 px-2 mx-2">F-Del</span>
          ) : null}
        </td>

        {circleInfo?.is_active ? (
          <>
            {/* ckeck if the member is auth user so that he/she can not vote for his own delegation  */}
            <th className="fw-bold">
              Yes
              <input
                type="checkbox"
                checked={put_forward}
                onChange={() => putForward()}
                className="form-check-input mx-2"
              />
              <span className="alert alert-primary p-0 px-2 mx-2">
                {member?.count_put_forward} votes
              </span>
            </th>
          </>
        ) : null}

        {/* if the circle is not active
             and the member is delegate
             then can he remove the member.
             otherwise, the members can vote out to remove.. */}

        {/* you can not not remove yourself. */}
        {member?.user?.username === AuthUser.username ? (
          <td>
            {/* check if the circle is dissolvable.  */}

            {dissolve === true ? (
              <>
                Dissolve This Circle {dissolve} ?
                <input
                  type="checkbox"
                  checked={clicked}
                  onChange={() => handleInputChange()}
                  className="form-check-input mx-2"
                />
              </>
            ) : null}
          </td>
        ) : circleInfo?.is_active === true ? (
          // if the user vote out this member
          <td>
            {" "}
            Yes
            {!voted_out ? (
              <input
                checked={voted_out}
                onChange={() => voteOut()}
                type="checkbox"
                className="form-check-input mx-2"
              />
            ) : null}
            <span className="alert alert-primary p-0 px-2 mx-2">
              {member?.count_vote_out} votes
            </span>
          </td>
        ) : (
          // if the circle is not active and the auth user is the delegate.
          // then he can remove the members.
          <td>
            {console.log("Iam delegate: ", Iam_delegate)}
            {Iam_delegate ? (
              <>
                <span> Yes </span>
                <input
                  checked={false}
                  onChange={() => removeMember()}
                  type="checkbox"
                  className="form-check-input mx-2"
                />
              </>
            ) : null}
          </td>
        )}
      </tr>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Dissolve Circle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will dissolve this Circle permanently, do you want to
          proceed?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleCloseModal}>
            {" "}
            No{" "}
          </Button>
          <Button variant="primary" onClick={() => removeCircle()}>
            {" "}
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
