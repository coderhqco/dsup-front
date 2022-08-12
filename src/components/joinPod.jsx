import {useSelector,useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {pod,authenticate} from '../store/userSlice.js';
import {baseURL} from '../store/conf.js'

function JoinPod(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const [inviteKey, setInviteKey] = useState('');
    const [message, setMessage] = useState({type:'alert alert-',msg:''});
    const [token, setToken] = useState('');
    const [POD, setPOD] = useState('');
    const [WS, setWS] = useState({});
    const [clicked, setClicked] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        // we need invitation key and username. token is required for request
        // after the joint, we have to redirect to the pod page
        if(clicked === 'pod'){
            if(token.length > 0){
                // console.log("ceating a pod...")
                let header = {'Authorization': `Bearer ${token}`}
                const url = `${window.location.protocol}//${baseURL}/api/create-pod/`
                const param = {"user": AuthUser.username, 'district':AuthUser.users.district.code}
                console.log(header, param)
                axios.post(url, param, {headers:header})
                .then( response => {
                    if(response.status === 400 ){
                        setMessage({msg:response.data.message,type: "alert alert-danger" })
                    }else if(response.status === 200){
                        dispatch(pod(response.data))
                        let u = {...AuthUser.users}
                        let userType = 1
                        let users = {...u,userType}
                        dispatch(authenticate({...AuthUser,users}))
                        setMessage({type:"alert alert-success", msg:"pod created."})
                        navigate('/house-keeping-page');
                    }else{
                        console.log("something went wrong:", response)
                    }
                })
                .catch(error => {
                    setMessage({msg:error.response?.data?.message, type:"alert alert-danger"})
                });
            }
        }else if(clicked === 'join'){
            // console.log("joining a pod ...")
            if(token.length > 0 && inviteKey.length === 10){
                let header = {'Authorization': `Bearer ${token}`}
                const url = `${window.location.protocol}//${baseURL}/api/join-pod/`
                const param = {"user": AuthUser.username, 'pod':inviteKey}
            
                axios.post(url, param, {headers:header})
                .then( response => {
                    if(response.status === 400 ){
                        setMessage({msg:response.data.message,type: "alert alert-danger" })
                    }else if(response.status === 200){
                        // set the user and create a store for pod
                        dispatch(pod(response.data))
                        let u = {...AuthUser.users}
                        let userType = 1
                        let users = {...u,userType}
                        dispatch(authenticate({...AuthUser,users}))
                        setMessage({type:"alert alert-success", msg:"Joint the pod. wait for the members to aprove you. Redirecting to Pod..."})
                        
                        setPOD(response.data.code)
                        
                    }else{
                        console.log("something went wrong:", response)
                    }
                })
                .catch(error => {
                    console.log("err: ", error)
                    setMessage({msg:error.response.data.message, type:"alert alert-danger"})
                });
            }{
                setMessage({type:'alert alert-danger', msg:"invalid invitation key"})
            }
        }

    },[token])

    useEffect(()=>{
        if(POD.length > 1){
            let ws_schame = window.location.protocol == "https:" ? "wss" : "ws";
            const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/pod/${POD}/${AuthUser.username}/`
            const chatSocket = new WebSocket(url);
            // get back the messages...
            chatSocket.onmessage = function(e) {
                const data = JSON.parse(e.data);
                if(data.type === 'podmember'){
                    console.log(data.data)
                }else if(data.type ==='joined'){
                    console.log("joined: ",data.data)
                }
                setWS(chatSocket);
            };
        }

    },[POD])

    useEffect(()=>{
        if(WS.url){
            WS.send(JSON.stringify({
                type: "joined",
                pod: POD
            }));
            WS.close()
            navigate('/house-keeping-page')
        }
    },[WS])

    
    function GetToken(from){
        // from is tell weather the join btn is clicked on create pod
        const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/refresh/`;
        const token_params = {refresh: AuthUser.token.refresh}
        axios.post(TokenUrl, token_params)
        .then(response =>{
            if(response.status === 200){
                // set the new access token and which btn is clicked via clicked const.
                setToken(response.data.access);
                setClicked(from)
                // console.log("token is set to a new token",from)
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

    const handleSubmit = () => {
        // get the access token and set the clicked to join
        GetToken('join');
    }
    const handlePod =()=>{
        GetToken('pod')
        // we need username and district code. token is required for request
        // after the creation pf pod, we have to redirect to pod page
    }
    
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-md-3"></div>
                <div className="col-sm-12 col-md-6 mt-3">
                    <h1 className="text-center">Join a Pod {AuthUser.userType}</h1>
                    <div className="">
                        <h4 className="text-left">You must have an Invitation Key to join a Pod.</h4>
                        <p className="text-left">The First Delegate of a pod should send you an Invitation Key. This cannot be done via the website.</p>
                        <p className="text-left">Or you can create your own Pod and start inviting others to join it.</p>
                        <div className='col text-center'>
                            <span onClick={handlePod} className="btn btn-primary btn-sm mb-3">Create a Pod</span>
                        </div>
                    </div>

                    {message.msg ?
                        <div  className={message.type} role="alert"> {message.msg}</div>
                    :""}
                    
                    <label className='text-left'>invitation Key</label>
                    <input type="text" onChange={(e)=> setInviteKey(e.target.value)} className="form-control" placeholder='Enter the pod invitation key here' />
                    <div className='col text-center'>
                        <button className="btn btn-success mt-2" onClick={handleSubmit}> Join the Pod</button>
                    </div>
                </div>
                <div className="col-sm-12 col-md-3"></div>
            </div>
        </div>
    )

}

export default JoinPod