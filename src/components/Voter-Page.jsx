import {Link} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {pod,authenticate} from '../store/userSlice';

function VoterPage(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [message, setMessage] = useState({type:'alert alert-',msg:''});
    const [token, setToken] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let date = new Date(AuthUser.date_joined)
    
    // fetch the pod data on login(load)
    useEffect(()=>{
        if(AuthUser.token.access.length > 0){
            const url = "http://127.0.0.1:8000/api/pod/";
            const params = {user: AuthUser.username}
            let header = {'Authorization': `Bearer ${AuthUser.token.access}`}
            axios.post(url, params, {headers: header})
            .then(response => {
                if(response.status === 200){
                    dispatch(pod(response.data))
                }else{
                    setMessage({type:"alert alert-danger",msg:"could not get access token"})
                }
            })
            .catch(error => {
                setMessage({type:"alert alert-danger",msg:"something went wrong with your request"})
                console.log(error)
            });
        }
    },[])

    useEffect(()=>{
        // this is for joining of pod
        // we need invitation key and username. token is required for request
        // after the joint, we have to redirect to the pod page

        if(token.length > 0){
            let header = {'Authorization': `Bearer ${token}`}

            const url = 'http://127.0.0.1:8000/api/create-pod/'
            const param = {"user": AuthUser.username, 'district':AuthUser.district}
            axios.post(url, param, {headers:header})
            .then( response => {
                if(response.status === 400 ){
                    setMessage({msg:response.data.message,type: "alert alert-danger" })
                }else if(response.status === 200){

                    dispatch(pod(response.data))
                    let u = {...AuthUser}
                    u.userType = 1
                    dispatch(authenticate(u))
                    setMessage({type:"alert alert-success", msg:"pod created."})
                    // nagivate to voter page...
                    navigate('/house-keeping-page');
                }else{
                    console.log("something went wrong:", response)
                }
            })
            .catch(error => {
                setMessage({msg:error.response?.data?.message, type:"alert alert-danger"})
            });
        }
    },[token])

    function GetToken(){
        // from is tell weather the join btn is clicked on create pod
        const TokenUrl = "http://127.0.0.1:8000/api/token/refresh/";
        const token_params = {refresh: AuthUser.token.refresh}
        axios.post(TokenUrl, token_params)
        .then(response =>{
            if(response.status === 200){
                // set the new access token and which btn is clicked via clicked const.
                setToken(response.data.access);
            }else{
                setMessage({type:"alert alert-danger",msg:"could not get access token"})
            }
        })
        .catch(error => {
            setMessage({type:"alert alert-danger",msg:"something went wrong with your request"})
            // setErr("Something went wrong. Check your inputs and try again.");
            console.log(error)
        }); 
    }

    const handleCreatePod =()=>{
        GetToken()
    }

    const houseKeepingType = () => {
        switch(AuthUser.userType){
            case 0 :
                return (
                    <div className="row text-center">
                        <div className="col-sm-12 ">
                            <Link to={'/join-pod'} className="btn btn-primary m-2">Join a Pod</Link>
                        </div>
                        <div className="col-sm-12 ">
                            <a onClick={handleCreatePod} className="btn btn-primary m-2">Create a Pod</a>
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="row text-center">
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <Link to='/house-keeping-page' className="btn btn-primary m-2"> My pod</Link>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <a className="btn btn-primary m-2" >Join First Link</a>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <a className="btn btn-primary m-2" >Create First Link</a>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6">
                        <a className="btn btn-primary m-2" >Back-and-Forth</a>
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
                        <div  className={message.type} role="alert"> {message.msg}</div>
                    :""}

                    {AuthUser.is_reg ? 
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
                    :""}
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h1 className="text-center">Voter Page for {AuthUser.legalName}</h1>
                    <h3 className="text-center">Your Verification Score: {AuthUser.verificationScore}/7</h3>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h1 className="text-center"> District: {AuthUser.district} </h1>
                </div>
            </div>

            {/* the three columns on  */}
            <div className="row">
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    <ul className="list-unstyled">
                        <li><Link  to={'/voter-page'}>List of Delegates</Link></li>
                        <li><Link  to={'/voter-page'}>Back-and-Forth</Link></li>
                        <li><Link  to={'/voter-page'}> Member Contact Page </Link></li>
                        <li><Link  to={'/voter-page'}>Pod Housekeeping Page</Link></li>
                    </ul>
                </div>
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    {houseKeepingType()}
                </div>
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    <ul className="list-unstyled">
                        <li><Link  to={'/voter-page'}>First Link Meeting Schedule</Link></li>
                        <li><Link  to={'/voter-page'}>Meeting Minutes Log</Link></li>
                        <li><Link  to={'/voter-page'}>Bill Metrics </Link></li>
                        <li><Link  to={'/voter-page'}>Voter Settings</Link></li>
                    </ul>
                </div>
            </div>
           
        </div>
    )
}
export default VoterPage;