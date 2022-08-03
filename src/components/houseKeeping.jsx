import {useSelector,useDispatch, } from 'react-redux';
// import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
// import axios from 'axios';
import {authenticate, addPodmMembers, desolvePod} from '../store/userSlice';

function HouseKeeping(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const pod = useSelector((state) => state.AuthUser.pod);
    const podMembers = useSelector((state) => state.AuthUser.podMembers);
    // const [token, setToken] = useState('');
    // const [action, setAction] = useState('');
    const [message, setMessage] = useState({})
    const [condidate, setCondidate] = useState({})
    const [members, setMembers] = useState({})

    const dispatch = useDispatch();
    // const navigate = useNavigate();

    useEffect(()=>{
        setMembers(podMembers?.filter((member)=> member.is_member))
        setCondidate(podMembers?.filter((member)=> !member.is_member))
    },[podMembers])

    useEffect(()=>{
        const url = `${process.env.REACT_APP_BASE_URL.replace('https:', 'wss:')}/ws/pod/${pod.code}/${AuthUser.username}/`
        console.log("url: ", url)
        const chatSocket = new WebSocket(url);
        // get backt the messages...
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if(data.data.podMembers){
                dispatch(addPodmMembers(data.data.podMembers))
            }
        };

        // what happens on closing the connection
        chatSocket.onclose = function(e) {
            setMessage({type:"alert alert-danger",msg:'Chat socket closed unexpectedly'})
        };

        // send message 
        // chatSocket.send(JSON.stringify({
        //     'message': "i love you"
        // }));

    },[])
    

    const handleDesolve =()=>{
        alert("this function is under construction")
    }
    const handleVoteIn = ()=>{
        alert("under construction")
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-md-3"></div>
                <div className="col-sm-12 col-md-6 mt-3">
                    <h1 className="text-center">House Keeping page</h1>
                    <h3 className='text-center'>pod: {pod.district}-{pod.code}</h3>
                    <h4 className='text-center'>Invitation Key: {pod.invitation_code}</h4>
                    <button className='d-block mx-auto my-2 btn btn-success text-center'>Generate new key</button>
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
                                <td>{member.user.users.legalName}  
                                    {member.is_delegate ? <span className='badge'>delegate</span>: ""}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    {podMembers.length === 1 ? 
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
                                    <label htmlFor="checkbox">YES</label>
                                    <input type="checkbox" onClick={handleVoteIn} className ='mx-2 form-check-input' />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                <input onClick={handleVoteIn} type="checkbox" className='form-check-input'  />
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