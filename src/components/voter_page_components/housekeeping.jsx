import { Link } from "react-router-dom";

export const houseKeepingType = (AuthUser, delegate, setAction) => {
  switch (AuthUser?.users?.userType) {
    case 0:
      return (
        <div className="row text-center">
          <div className="col-sm-12 ">
            <Link to={"/join-circle"} className="btn btn-success m-2">
              Join a Circle
            </Link>
          </div>
          <div className="col-sm-12 ">
            <button
              onClick={() => setAction("createCircle")}
              className="btn btn-success m-2">
              Create a Circle
            </button>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="row text-center">
          <div className="col-sm-12 col-lg-6 my-1">
            <Link to="/house-keeping-page" className="btn btn-primary ">
              My Circle
            </Link>
          </div>
          {/* add if the user is delegate and then show this two. */}
          {AuthUser?.username === delegate?.user?.username ? (
            <>
              <div className="col-sm-12 col-lg-6 my-1">
                <Link
                  to="/join-sec-del"
                  className="btn btn-primary "
                  style={{ whiteSpace: "nowrap" }}>
                  Join F-Link
                </Link>
              </div>
              <div className="col-sm-12 col-lg-6 my-1">
                <button
                  className="btn btn-primary "
                  style={{ whiteSpace: "nowrap" }}>
                  Create F-Link
                </button>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="col-sm-12 col-lg-6 my-1">
            <Link
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap" }}
              to={"/circle-back-n-forth"}>
              Back & Forth
            </Link>
            {/* <a className="btn btn-primary m-2" >Back-and-Forth</a> */}
          </div>
        </div>
      );
    case 2:
      return (
        <div className="row text-center">
          <div className="col-sm-12 my-1">
            <Link to="/first-link-page" className="btn btn-primary ">
              My F-Link
            </Link>
          </div>
          {/* add if the user is delegate and then show this two. */}
          {AuthUser?.username === delegate?.user?.username ? (
            <>
              <div className="col-sm-12 my-1">
                <Link
                  to="#"
                  className="btn btn-primary "
                  style={{ whiteSpace: "nowrap" }}>
                  Join Second Delegate Link
                </Link>
              </div>
              <div className="col-sm-12 my-1">
                <Link
                  to="#"
                  className="btn btn-primary "
                  style={{ whiteSpace: "nowrap" }}>
                  Create Second Delegate Link
                </Link>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="col-sm-12  my-1">
            <Link
              className="btn btn-primary"
              style={{ whiteSpace: "nowrap" }}
              to={"/"}>
              Back & Forth
            </Link>
            {/* <a className="btn btn-primary m-2" >Back-and-Forth</a> */}
          </div>
        </div>
      );

    default:
      return (
        <div className="row text-center">
          <h5>Something is wrong with your registration.</h5>
        </div>
      );
  }
};
