import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { pod, authenticate } from '../store/userSlice.js';
import { baseURL } from '../store/conf.js'
import jwtDecode from 'jwt-decode';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';

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
    const [bills, setBills] = useState([]);

    let date = new Date(AuthUser.date_joined)

    // placeholder rows below before we get the data from the backend for each bill 
    const rows = Array(10).fill().map((_, i) => i + 1);


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

    // useEffect(() => {
    //     if (AuthUser.users.userType === 1) {
            

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
                                <a className="btn btn-primary m-2" >Join First Link</a>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <a className="btn btn-primary m-2" >Create First Link</a>
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
            <Container style = {{marginTop: "2%"}}>
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

            {/* the three columns on  */}
            <div className="row">
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
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
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    <ul className="list-unstyled">
                        <li className="mb-2"><Link to={'/voter-page'}> First Link Meeting Schedule </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}>  Meeting Minutes Log </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}> Bill Metrics </Link></li>
                        <li className="mb-2"><Link to={'/voter-page'}> Voter Settings </Link></li>
                    </ul>
                </div>
            </div>
            <h1 className="header-cursive" style={{ marginBottom: "1%" }}>Upcoming Bills...</h1>
            <p> <Link> See full list of bills... </Link></p>
            {/* <div className="d-flex flex-row flex-nowrap overflow-auto">
                {[...Array(12)].map((_, index) => (
                    <Card key={index} style={{ minWidth: '300px' }} className="mx-2">
                        <Card.Body>
                            <Card.Title>Card Title {index + 1}</Card.Title>
                            <Card.Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div> 
            // this is the scrollale card version of the table below
            */}

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>HR #</th>
                        <th>Short Title</th>
                        <th>Scheduled...</th>
                        <th>Username</th>
                        <th>Your Vote</th>
                        <th>Advisement</th>
                        <th>District Tally</th>
                        <th>National Tally</th>
                        <th>More...</th>
                        <th>Metrics</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row}>
                            <td>Bill {row}</td>
                            <td>BILL NAME</td>
                            <td>DATE</td>
                            <td>VOTE</td>
                            <td>YEA</td>
                            <td>None</td>
                            <td>#</td>
                            <td>#</td>
                            <td> <Link to={'/bills/${row}'}>Link</Link></td>
                            <td>Info</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
export default VoterPage;