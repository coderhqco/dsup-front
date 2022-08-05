import {useSelector,useDispatch, } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
// import axios from 'axios';
import {authenticate,pod, addPodmMembers, desolvePod} from '../store/userSlice';

function HouseKeeping(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const podInfo = useSelector((state) => state.AuthUser.pod);
    const podMembers = useSelector((state) => state.AuthUser.podMembers);
    const [message, setMessage] = useState({})
    const [voteIn, setVoteIn] = useState('')
    const [condidate, setCondidate] = useState({})
    const [members, setMembers] = useState({})

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        setMembers(podMembers?.filter((member)=> member.is_member))
        setCondidate(podMembers?.filter((member)=> !member.is_member))
    },[podMembers])

    const url = `ws://${process.env.REACT_APP_BASE_URL}/ws/pod/${podInfo?.code}/${AuthUser.username}/`
    const chatSocket = new WebSocket(url);

    useEffect(()=>{
        // get backt the messages...
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if(data.type){
                switch(data.type){
                    case 'podmember':
                        dispatch(addPodmMembers(data.data.podMembers))
                        dispatch(pod(data.data.pod))
                        break
                    case 'podInvitationKey':
                        dispatch(pod(data.data.data))
                        break
                    case 'voteIn':
                        if(data.data.done && data.data.is_member){
                            // alert("voted in and condidate is member")
                            dispatch(addPodmMembers(data.data.data))
                            setVoteIn(data.data.voter)
                        }else if(!data.data.is_member && data.data.done){
                            // alert("you have voted for this condidate:  ")
                            setVoteIn(data.data.voter)
                        }else if(!data.data.done){
                            // alert(data.data.data)
                            setVoteIn(data.data.voter)
                        }
                        break

                    case 'voteOut':
                        console.log(data)
                        break
                    case 'desolvePod':
                        if(data.data.done){
                            dispatch(desolvePod())
                            // set the userType to 0 and reset AuthUser
                            let u = {...AuthUser}
                            u.userType = 0
                            dispatch(authenticate(u))
                            // navigate back to voter page
                            navigate('/voter-page');
                        }
                        
                        break
                    case 'chat_message':
                        console.log(data)
                        break
                }
            } //end of if(data.type)
        };

        // what happens on closing the connection
        chatSocket.onclose = function(e) {
            console.log("chat socket closed...")
            // setMessage({type:"alert alert-danger",msg:'Chat socket closed unexpectedly'})
        };

    },[])
    

    const handleDesolve =()=>{
        console.log("desolving the pod...")
        chatSocket.send(JSON.stringify({
            type: "desolvePod",
            pod: podInfo.code,
            user: AuthUser.username,
        }));
    }
    const handleChngInvtKey =()=>{
        chatSocket.send(JSON.stringify({
            type: "podInvitationKey",
            pod: podInfo.code,
        }));
    }
    const handleVoteIn = (e)=>{
        if(voteIn){
            alert("you have already voted for this condidate.")
        }else{
            chatSocket.send(JSON.stringify({
                type: "voteIn",
                pod: podInfo.code,
                voter: AuthUser.username,
                condidate: e.target.value
            }));
        }
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-md-3"></div>
                <div className="col-sm-12 col-md-6 mt-3">
                    <h1 className="text-center">House Keeping page</h1>
                    <h3 className='text-center'>pod: {podInfo?.district.code}-{podInfo?.code}</h3>
                    <h4 className='text-center'>Invitation Key: {podInfo?.invitation_code}</h4>
                    <button className='d-block mx-auto my-2 btn btn-success text-center' onClick={handleChngInvtKey}>Generate new key</button>
                </div>
                <div className="col-sm-12 col-md-3"></div>
            </div>
            <div className="row">
                <table className='table table-bordered '> 
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Member Name</th>
                            <th>Do you want this voter to be a member?</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Removal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members?.length > 0 ? 
                         members?.map((member, index)=>(
                            <tr key={index} className="border">
                                <td>{index+1}</td>
                                <td>{member?.user.users.legalName}  
                                    {member?.is_delegate ? <span className='badge'>delegate</span>: ""}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    {podMembers?.length === 1 ? 
                                        <button onClick={()=>handleDesolve()} className='btn btn-danger'>Desolve</button>
                                    :""}
                                </td>
                            </tr>
                        ))
                        : ""}
                        {condidate?.length > 0 ? 
                            <tr>
                                <td >01</td>
                                <td>{condidate[0]?.user.users.legalName}</td>
                                <td>
                                    {voteIn === AuthUser.username ? 
                                    <p>voted</p>
                                    :
                                    <>
                                    <label htmlFor="checkbox">YES</label>
                                    <input type="checkbox" value={condidate[0].id} onChange={handleVoteIn} className ='mx-2 form-check-input' />
                                    </>
                                    }
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                <input onClick={(e)=>handleVoteIn(e)} type="checkbox" className='form-check-input'  />
                                </td>
                                
                            </tr>
                        :""}
                       
                    </tbody>
                </table>
            </div>
            <div className="row border p-3 shadow-sm">
                <p><strong>Status: </strong> This Pod will become active when it has six members.</p>
                <p>There are no Member Candidates. Invite voters in your district to join by giving them a Pod Invitation Key.</p>
                <p>Once you generate a new key, the old one will not work.</p>
                <p>
                As the creator of this Pod, you have automatically been made First Delegate. The Members 
                of a Pod can elect a different First Delegate, after the Pod has six or more Members, by
                holding an election.
                </p>
                <p>Only the F-Del can dissolve a Pod, and may only do so when they are the only member left.</p>
            </div>
        </div>
    )

}

export default HouseKeeping