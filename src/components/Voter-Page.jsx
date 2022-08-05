import {Link} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {pod,authenticate} from '../store/userSlice';
import {baseURL} from '../store/conf'

function VoterPage(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [message, setMessage] = useState({type:'alert alert-',msg:''});
    const [token, setToken] = useState('');
    const [action,setAction] = useState('');
    const [pageLoaded, setPageLoaded] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    let date = new Date(AuthUser.date_joined)

    // useEffect(()=>{
    //     // from is tell weather the join btn is clicked on create pod
    //     console.log("getting a new access token...")
    //     const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
    //     const token_params = {refresh: AuthUser.token.refresh}
    //     console.log("param: ", token_params)
    //     axios.post(TokenUrl, token_params)
    //     .then(response =>{
    //         if(response.status === 200){
    //             // set the new access token and which btn is clicked via clicked const.
    //             console.log("new token is : ", response.data)
    //             setToken(response.data.access);
    //             // set the new token to user.token as well.
    //             let u = {...AuthUser}
    //             u.token = response.data
    //             dispatch(authenticate(u))
    //             console.log("a new access token is set now.")
    //         }else{
    //             setMessage({type:"alert alert-danger",msg:"could not get access token"})
    //         }
    //     })
    //     .catch(error => {
    //         setMessage({type:"alert alert-danger",msg:"something went wrong with your request"})
    //         // setErr("Something went wrong. Check your inputs and try again.");
    //         console.log(error)
    //     }); 
    // },[])


    useEffect(()=>{
        const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
        const token_params = {refresh: AuthUser.token.refresh}
        axios.post(TokenUrl, token_params)
        .then(response =>{
            if(response.status === 200){
                // set the new access token and which btn is clicked via clicked const.
                setToken(response.data.access);
                let u = {...AuthUser}
                u.token = {refresh: AuthUser.token.refresh, access: response.data.access}
                dispatch(authenticate(u))
                console.log("token is set on token and authuser.token")
               
                setAction('userinfo')
            }else{
                setMessage({type:"alert alert-danger",msg:"could not get access token"})
            }
        })
        .catch(error => {
            setMessage({type:"alert alert-danger",msg:"something went wrong with your request"})
            // setErr("Something went wrong. Check your inputs and try again.");
            console.log(error)
        }); 
    },[])

    useEffect(()=>{
        switch(action){
            // if no action is specified, fetch user info and pod
            case 'userinfo':
                console.log("getting user info")
                if(AuthUser.token.access.length > 0){
                    const url = `${window.location.protocol}//${baseURL}/api/userinfo/`;
                    const params = {user: AuthUser.username}
                    let header = {'Authorization': `Bearer ${AuthUser.token.access}`}
                    axios.post(url, params, {headers: header})
                    .then(response => {
                        if(response.status === 200){
                            let token = AuthUser.token
                            dispatch(authenticate({...response.data.user,token}))
                            if(response.data.user.users.userType===1){
                                dispatch(pod(response.data.pod))
                            }
                            console.log("user and pod is set.")
                        }else{
                            setMessage({type:"alert alert-danger",msg:"could not get user info and pod"})
                        }
                    })
                    .catch(error => {
                        console.log("error on fetching user and pod info:",error)
                    });
                }
                
                break
            case 'joinPd':
                console.log("joining a pod here")
                break
            case 'createPod':
                console.log("creating a pod")
                if(token.length > 0){
                    let header = {'Authorization': `Bearer ${token}`}
                    const url = `${window.location.protocol}//${baseURL}/api/create-pod/`
                    const param = {"user": AuthUser.username, 'district':AuthUser.users.district.code}
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
                        console.log("err: ", error)
                        setMessage({msg:error.response?.data?.message, type:"alert alert-danger"})
                    });
                }
                break
            default:
                console.log("defualt is here")
        }
    },[action])

    function GetToken(){
        // // from is tell weather the join btn is clicked on create pod
        // const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
        // const token_params = {refresh: AuthUser.token.refresh}
        // axios.post(TokenUrl, token_params)
        // .then(response =>{
        //     if(response.status === 200){
        //         // set the new access token and which btn is clicked via clicked const.
        //         setToken(response.data.access);
        //         let u = {...AuthUser}
        //         u.token = response.data
        //         dispatch(authenticate(u))
        //         console.log("user token and token are set")
        //     }else{
        //         setMessage({type:"alert alert-danger",msg:"could not get access token"})
        //     }
        // })
        // .catch(error => {
        //     setMessage({type:"alert alert-danger",msg:"something went wrong with your request"})
        //     // setErr("Something went wrong. Check your inputs and try again.");
        //     console.log(error)
        // }); 
    }

    const houseKeepingType = () => {
        switch(AuthUser?.users?.userType){
            case 0 :
                return (
                    <div className="row text-center">
                        <div className="col-sm-12 ">
                            <Link to={'/join-pod'} className="btn btn-primary m-2">Join a Pod</Link>
                        </div>
                        <div className="col-sm-12 ">
                            <a onClick={()=>setAction('createPod')} className="btn btn-primary m-2">Create a Pod</a>
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
                        <div  className={message?.type} role="alert"> {message?.msg}</div>
                    :""}

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
                    :""}
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h1 className="text-center">Voter Page for {AuthUser?.users?.legalName}</h1>
                    <h3 className="text-center">Your Verification Score: {AuthUser?.users?.verificationScore}/7</h3>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h1 className="text-center"> District: {AuthUser.users?.district?.code} </h1>
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