import { useSelector } from "react-redux";
export default function UserCard() {
  const AuthUser = useSelector((state) => state.AuthUser.user);
  return (
    <div className="container">
      <div className="row align-items-start">
        <div className="col-md-10 offset-md-1 ">
          <div className="card rounded-3 bg-light">
            <div className="row text-center m-0">
              <div className="col-sm-12 col-md-4  p-1">
                <h1 className="fs-4 m-0">Voter Name</h1>
                <p className="m-0 text-capitalize">{AuthUser?.users?.legalName}</p>
              </div>
              <div className="col-sm-12 col-md-4 user-card-middle-border p-1">
                <h1 className="fs-4 m-0">
                  Verification Score&nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24">
                    <path
                      fill="#31302c"
                      d="M12 1.25h-.057c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529V12a.75.75 0 0 0-1.5 0c0 2.378-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62c.57-.569 1.34-.896 2.619-1.068c1.3-.174 3.008-.176 5.386-.176a.75.75 0 0 0 0-1.5"
                    />
                    <path
                      fill="#31302c"
                      d="M12.47 10.47a.75.75 0 1 0 1.06 1.06l7.72-7.72v3.534a.75.75 0 0 0 1.5 0V2a.75.75 0 0 0-.75-.75h-5.344a.75.75 0 0 0 0 1.5h3.533z"
                    />
                  </svg>
                </h1>
                <p className="m-0">{AuthUser.users?.verificationScore}/7</p>
              </div>
              <div className="col-sm-12 col-md-4 p-1">
                <h1 className="fs-4 m-0">
                  District&nbsp;
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24">
                    <path
                      fill="#31302c"
                      d="M12 1.25h-.057c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529V12a.75.75 0 0 0-1.5 0c0 2.378-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62c.57-.569 1.34-.896 2.619-1.068c1.3-.174 3.008-.176 5.386-.176a.75.75 0 0 0 0-1.5"
                    />
                    <path
                      fill="#31302c"
                      d="M12.47 10.47a.75.75 0 1 0 1.06 1.06l7.72-7.72v3.534a.75.75 0 0 0 1.5 0V2a.75.75 0 0 0-.75-.75h-5.344a.75.75 0 0 0 0 1.5h3.533z"
                    />
                  </svg>
                </h1>
                <p className=" m-0">{AuthUser?.users?.district.code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
