import { Link } from "react-router-dom";

const Status = ({
  Iam_candidate,
  Iam_delegate,
  Iam_member,
  circleInfo,
  candidate,
}) => {
  return (
    <>
      {/* message status area */}
      <div className="row border p-3 shadow-sm">
        <p>
          <strong>Status: </strong>
          {circleInfo?.is_active
            ? "This First Link is active!"
            : "This First Link will become active when it has six members."}{" "}
        </p>
        {Iam_delegate ? (
          <>
            {candidate.length >= 1 ? (
              <p>
                There is a Member Candidate awaiting a majority vote of existing
                members.
              </p>
            ) : (
              <p>
                There are no Member Candidates. Invite voters in your district
                to join by giving them a First Link Invitation Key.
              </p>
            )}
            <p>Once you generate a new key, the old one will not work.</p>
            <p>
              The creator of this First Link has been automatically made First
              Delegate. To elect a different First Delegate, hold an election.
              Elections can be held when you have six or more members.
            </p>
            <p>
              Only the F-Del can dissolve a First Link, and may only do so when
              they are the only member left.
            </p>
          </>
        ) : (
          <> </>
        )}

        {Iam_member === true && Iam_delegate === false ? (
          <>
            <p>You are a member of the First Link.</p>
            {candidate.length >= 1 ? (
              <p>
                There is a Member Candidate awaiting a majority vote of existing
                members. Check the Yes box next to their name to vote them in. A
                running total of member votes for this candidate will appear in
                the Total column. When a Candidate receives a majority of the
                votes of existing members, they will automatically become a
                Member, and the voting will be ‘forgotten’ by the database.
              </p>
            ) : null}

            <p>
              If you want someone to join this First Link, give them the CIK.
              Make sure it is the most recent (currently valid) CIK generated by
              the F-Del. If you encounter any problems, please contact the F-Del
              In Real Life, or ElseWhere On The Internet.
            </p>
            <p>
              Until this First Link becomes active, you can be removed by the
              F-Del at any time.
            </p>
            <span>
              After this First Link becomes active, you can only be removed by:
              <ol>
                <li>
                  Unchecking the Yes box next to 'Would you like to remain in
                  this First Link'
                </li>
                <li> Being voted out by a majority of existing members. </li>
              </ol>
            </span>
            <p>
              Once a member is removed from a specific First Link, they cannot
              attempt to rejoin it without a new First Link Invitation Key.
            </p>
            <p>
              The creator of this First Link has been automatically made First
              Delegate. To elect a different First Delegate, your First Link can
              hold an election. Elections can be held when you have six or more
              members.
            </p>
            <p>
              Only the F-Del can dissolve a First Link, and may only do so when
              they are the only member left.
            </p>
          </>
        ) : (
          <> </>
        )}

        {Iam_candidate ? (
          <>
            <p>
              You are a Member Candidate awaiting a majority vote of existing
              members.
            </p>
            <p>
              You can wait to see if you are voted in, or you can contact the
              F-Del of this First Link IRL to discuss being voted in.
            </p>
            <p>
              If you shouldn’t be trying to join this First Link for any reason,
              the F-Del can remove you as a member candidate. After that
              happens, you will not be able to attempt to join this First Link
              unless you are given a new Invitation Key. Ask your F-Del IRL.
            </p>
            <p>
              The creator of this First Link has been automatically made First
              Delegate. To elect a different First Delegate, your First Link can
              hold an election. Elections can be held when you have six or more
              members.
            </p>
            <p>
              Only the F-Del can dissolve a First Link, and may only do so when
              they are the only member left.
            </p>
          </>
        ) : (
          <> </>
        )}
      </div>
      <div className="row">
        {/* helper links for delegate */}
        {Iam_delegate ? (
          <div className="row mt-2">
            <strong>Learn about:</strong>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Active vs inactive First Link.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              How to invite new members.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              How to hold a First Delegate Election.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              How to dissolve a First Link.
            </Link>
          </div>
        ) : null}

        {Iam_member === true && Iam_delegate === false ? (
          <div className="row mt-2">
            <strong>Learn about:</strong>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Invite someone to join this First Link.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Being removed from this First Link.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              Elect a new first Delegate.
            </Link>
            <Link className="mx-3 text-secondary" to="/house-keeping-page">
              First Link Dessolution.
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Status;
