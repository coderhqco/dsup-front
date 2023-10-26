import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { pod, authenticate } from '../store/userSlice.js';
import { baseURL } from '../store/conf.js'
import jwtDecode from 'jwt-decode';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import { retrieveBillsSuccess } from '../store/billSlice';

function VoterPage() {
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [message, setMessage] = useState({ type: 'alert alert-', msg: '' });
    const [token, setToken] = useState('');
    const [action, setAction] = useState('');
    // eslint-disable-next-line
    const [pageLoaded, setPageLoaded] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const podMembers = useSelector((state) => state.AuthUser.podMembers);
    const [delegate, setDelegate] = useState(podMembers?.filter((e) => e.is_delegate === true)[0]);
    const bills = useSelector((state) => state.bills.bills);

    let date = new Date(AuthUser.date_joined)

    // get the new access token on each page load or redirect
    useEffect(() => {
        const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
        const token_params = { refresh: AuthUser.token.refresh }
        axios.post(TokenUrl, token_params)
            .then(response => {
                if (response.status === 200) {
                    // set the new access token and which btn is clicked via clicked const.
                    setToken(response.data.access);
                    let u = { ...AuthUser }
                    u.token = { refresh: AuthUser.token.refresh, access: response.data.access }
                    dispatch(authenticate(u))
                    console.log("token is set on token and authuser.token")

                    setAction('userinfo')
                } else {
                    setMessage({ type: "alert alert-danger", msg: "could not get access token" })
                }
            })
            .catch(error => {
                setMessage({ type: "alert alert-danger", msg: "something went wrong with your request" })
                // setErr("Something went wrong. Check your inputs and try again.");
                console.log(error)
            });
    }, [])


    useEffect(() => {
        switch (action) {
            // if no action is specified, fetch user info and pod
            case 'userinfo':
                if (AuthUser.token.access.length > 0) {
                    const url = `${window.location.protocol}//${baseURL}/api/userinfo/`;
                    const params = { user: AuthUser.username }
                    let header = { 'Authorization': `Bearer ${AuthUser.token.access}` }
                    axios.post(url, params, { headers: header })
                        .then(response => {
                            if (response.status === 200) {
                                let token = AuthUser.token
                                dispatch(authenticate({ ...response.data.user, token }))
                                if (response.data.user.users.userType === 1) {
                                    dispatch(pod(response.data.pod))
                                }
                            } else {
                                setMessage({ type: "alert alert-danger", msg: "could not get user info and pod" })
                            }
                        })
                        .catch(error => {
                            console.log("error on fetching user and pod info:", error)
                        });
                }
                break
            case 'joinPd':
                console.log("joining a pod here")
                break
            case 'createPod':
                console.log("creating a pod")
                if (token.length > 0) {
                    let header = { 'Authorization': `Bearer ${token}` }
                    const url = `${window.location.protocol}//${baseURL}/api/create-pod/`
                    const param = { "user": AuthUser.username, 'district': AuthUser.users.district.code }
                    axios.post(url, param, { headers: header })
                        .then(response => {
                            if (response.status === 400) {
                                setMessage({ msg: response.data.message, type: "alert alert-danger" })
                            } else if (response.status === 200) {
                                dispatch(pod(response.data))
                                let u = { ...AuthUser }
                                u.userType = 1
                                dispatch(authenticate(u))
                                setMessage({ type: "alert alert-success", msg: "pod created." })
                                // nagivate to voter page...
                                navigate('/house-keeping-page');
                            } else {
                                console.log("something went wrong:", response)
                            }
                        })
                        .catch(error => {
                            console.log("err: ", error)
                            setMessage({ msg: error.response?.data?.message, type: "alert alert-danger" })
                        });
                }
                break
            default:
                console.log("defualt is here")
        }
    }, [action])

    useEffect(() => {
        const isTokenExpired = () => {
            const decodedToken = jwtDecode(AuthUser.token.refresh);
            return decodedToken.exp < Date.now() / 1000;
        };

        if (isTokenExpired()) {
            navigate('/enter-the-floor');
        }
    }, []);

    const houseKeepingType = () => {
        switch (AuthUser?.users?.userType) {
            case 0:
                return (
                    <div className="row text-center">
                        <div className="col-sm-12 ">
                            <Link to={'/join-pod'} className="btn btn-success m-2">Join a Pod</Link>
                        </div>
                        <div className="col-sm-12 ">
                            <a onClick={() => setAction('createPod')} className="btn btn-success m-2">Create a Pod</a>
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="row text-center">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <Link to='/house-keeping-page' className="btn btn-primary m-2 fixed-height-button"> My Pod</Link>
                        </div>
                        {/* add if the user is delegate and then show this two. */}
                        {AuthUser?.username === delegate?.user?.username ? <>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <a className="btn btn-primary m-2 fixed-height-button" >Join First Link</a>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <a className="btn btn-primary m-2 fixed-height-button" >Create First Link</a>
                            </div>
                        </>
                            : ""}
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <Link className='btn btn-primary m-2 fixed-height-button' to={'/pod-back-n-forth'}>Back-and-Forth</Link>
                            {/* <a className="btn btn-primary m-2" >Back-and-Forth</a> */}
                        </div>
                    </div>
                )

            default:
                return (
                    <div className='row text-center'>
                        <h5>Something is wrong with your registration.</h5>
                    </div>
                )
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {message.msg ?
                        <div className={message?.type} role="alert"> {message?.msg}</div>
                        : ""}

                    {AuthUser?.users?.is_reg ?
                        <div className="alert alert-warning mt-3">
                            <p>
                                You have to got until <span className='text-danger'>{date.toDateString()}</span> to
                                registered to vote in your district or your account will be deleted! Yikes!
                                <a href="#"> Learn More</a>.
                            </p>
                            <p>
                                But, if you have gotten registered since the last time you entered the floor,
                                <a href="#"> click here</a>.
                            </p>
                        </div>
                        : ""}
                </div>
            </div>
            <Container style={{ marginTop: "2%" }} >
                <Row>
                    <Col>
                        <Row>
                            <Col xs="auto">
                                <p className="text-left">Voter:</p>
                            </Col>
                            <Col>
                                <h1>{AuthUser?.users?.legalName}</h1>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col xs="auto">
                                <p className="text-left">Verification Score:</p>
                            </Col>
                            <Col>
                                <h1>{AuthUser?.users?.verificationScore}/7</h1>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col xs="auto">
                                <p className="text-left">District:</p>
                            </Col>
                            <Col>
                                <h1>{AuthUser.users?.district?.code}</h1>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* the three columns on  kyle note: fix to center the below when on mobile*/}

            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-sm-12 col-md-4 d-flex justify-content-center text-lg-start text-center text-md-start">
                    <ul className="list-unstyled">
                        <li className="mb-2"><Link to={'/voter-page'}>List of Delegates</Link></li>
                        <li className="mb-2"><Link to={'/pod-back-n-forth'}> Back-and-Forth </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}>  Member Contact Page </Link></li>
                        <li className="mb-2"><Link to={'/house-keeping-page'}>  Pod Housekeeping Page </Link></li>
                    </ul>
                </div>
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    {houseKeepingType()}
                </div>
                <div className="col-sm-12 col-md-4 d-flex justify-content-center text-lg-start text-center text-md-start">
                    <ul className="list-unstyled">
                        <li className="mb-2"><Link to={'/voter-page'}> First Link Meeting Schedule </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}>  Meeting Minutes Log </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}> Bill Metrics </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}> Voter Settings </Link></li>
                    </ul>
                </div>
            </div>
            <h1 className="header-semibold" style={{ marginBottom: "1%" }}>Bills With Latest Action...</h1>
            <p> <Link> See full list of bills... </Link></p>

            <Table striped bordered hover responsive>
                <thead>
                    <tr className='bills-list-voter-page-header-row'>
                        <th>HR #</th>
                        <th>Short Title</th>
                        <th>Latest Action</th>
                        <th>Your Vote</th>
                        <th>Advisement</th>
                        <th>District Tally</th>
                        <th>National Tally</th>
                        <th>Bill Link</th>
                        <th>Metrics</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.slice(0, 10).map((bill, index) => (
                        <tr key={index}>
                            <td>{bill.number}</td>
                            <td>{bill.title}</td>
                            {/* Include other bill properties as needed */}
                            <td>{bill.latest_action_date}</td>
                            <td>{bill.your_vote}</td>
                            {/* Need to add advisement as an attribute on the bills model*/}
                            <td>{bill.advisement}</td>
                            <td>{bill.district_tally}</td>
                            <td>{bill.national_tally}</td>
                            <td><a href={bill.url}>Link</a></td>
                            <td>TBD</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
export default VoterPage;