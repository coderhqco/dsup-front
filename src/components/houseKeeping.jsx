import {useSelector,useDispatch, } from 'react-redux';
import {useNavigate,Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {authenticate,pod, addPodmMembers, desolvePod, podVoteIn} from '../store/userSlice.js';

function HouseKeeping(){
    const AuthUser      = useSelector((state) => state.AuthUser.user);
    const podInfo       = useSelector((state) => state.AuthUser.pod);
    const podMembers    = useSelector((state) => state.AuthUser.podMembers);
    const VoteIn        = useSelector((state) => state.AuthUser.podVoteIn);
    const dispatch      = useDispatch();
    const navigate      = useNavigate();
    // saparetes the condidates and members
    const [condidate, setCondidate]   = useState('')
    const [members, setMembers]       = useState('')

    // for models to show and close
    const [showModel, setShowModel] = useState(false);
    const [modelContent, setModelContent] = useState('')
    const handleModelClose = () => setShowModel(false);
    const [act, setAct] = useState(null)
    const [removeMember ,setRemoveMember] = useState(null)

    let voted = {}
    // let Is_delegate = false
    const [Is_delegate, setIs_delegate] = useState(false)
    
    // saperate condidates on each page load or podmembers changes
    useEffect(()=>{

        setMembers(podMembers?.filter((member)=> member.is_member))
        setCondidate(podMembers?.filter((member)=> !member.is_member))
    },[podMembers])

    let ws_schame = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/ws/pod/${podInfo?.code}/${AuthUser.username}/`
    const chatSocket = new WebSocket(url);

    useEffect(()=>{
        // get back the messages...
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            if(data.type){
                switch(data.type){
                    case 'podmember':
                        console.log("m: ", data.data.podMembers)
                        dispatch(addPodmMembers(data.data.podMembers))
                        dispatch(pod(data.data.pod))
                        break
                    case 'podInvitationKey':
                        dispatch(pod(data.data.data))
                        break
                    case 'joined':
                        dispatch(addPodmMembers(data.data.data))
                        break
                    case 'voteIn':
                        if(data.data.done && data.data.is_member){
                            dispatch(addPodmMembers(data.data.data.podmembers))
                            dispatch(pod(data.data.data.pod))
                            // remove the vote in
                            localStorage.removeItem('podVoteIn')
                            // dispatch(podVoteIn({
                            //     voter:data.data.voter,
                            //     condidate: data.data.condidate,
                            //     done: data.data.done,
                            //     data:'voted in',
                            //     type: 'voteIn'
                            // }))

                        }else if(!data.data.is_member && data.data.done){
                            dispatch(podVoteIn(data.data)) 
                        }else if(!data.data.done){
                            dispatch(podVoteIn(data.data)) 
                            alert(data.data.data)
                        }
                        break

                    case 'voteOut':
                        if(!data.data.done){
                            alert(data.data.data)
                        }else if(data.data.done){
                            // add data to state
                            dispatch(addPodmMembers(data.data.data))
                        }
                        break
                    case 'delegate':
                        if(!data.data.done){
                            alert(data.data.data)
                        }else if(data.data.done){
                            dispatch(addPodmMembers(data.data.data))
                        }

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
                    case 'removemember':
                        dispatch(addPodmMembers(data.data.data.podMembers))
                        dispatch(pod(data.data.data.pod))
                        setShowModel(false)
                        // check here to remove from votedin this member
                        const Vins = VoteIn.filter((i)=> !i.condidate === data.data.done)
                        
                        localStorage.removeItem('podVoteIn')
                        if(Vins.length>0){
                            dispatch(podVoteIn(Vins))
                        }
                        // check for the member being removed to be redirected too voter page 
                        // after setting the userType back to zero and remove the pod and podmember
                        // from localstorage...

                        // check if the data.data.done is the username of the logged in user
                        if(data.data.done === AuthUser.username){
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
        };

    },[])

    // handing the changing of the pod key invitation
    const handleChngInvtKey =()=>{
        chatSocket.send(JSON.stringify({
            type: "podInvitationKey",
            pod: podInfo.code,
        }));
    }

    // this handles the voting process for a condidate.
    const handleVoteIn = (e)=>{
        chatSocket.send(JSON.stringify({
            type: "voteIn",
            pod: podInfo.code,
            voter: AuthUser.username,
            condidate: e.target.value
        }));
    }

    // check if the the user has already voted for the condidate. 
    VoteIn.map((e)=>{
        if(e.voter === AuthUser.username && condidate[0]?.user.username === e.condidate){
           voted = e
        }
    })

    // this is for the condidates voted in counts
    let voteCond = VoteIn.filter((i)=>{
        return condidate[0]?.user.username === i.condidate
    })

    // check if the user logged in is delegate.
    useEffect(()=>{
        if(members){
            if(members[0]?.user.username === AuthUser?.username && members[0].is_delegate){
                setIs_delegate(true)
            }
        }
    },[members])
    // removing the pod permemently.
    const handleDesolve =()=>{
        console.log("desolving the pod...")
        chatSocket.send(JSON.stringify({
            type: "desolvePod",
            pod: podInfo.code,
            user: AuthUser.username,
        }));
    }
    const handleRemove =()=>{
        console.log("removing the condidate/member: ",removeMember)
        chatSocket.send(JSON.stringify({
            type: "removemember",
            pod: podInfo.code,
            member: removeMember,
            user: AuthUser.username,
        }));
        // setShowModel(false)
    }

    // check if the pod should be desolved
    const handleModelShow = (param,member) =>{
        switch(param){
            case 'dessolvePod':
                setModelContent(`This action will dissolve this Pod permanently, do you want to proceed?`)
                setAct('dessolvePod')
                setShowModel(true);
                break
            case 'removemember':
                setModelContent (`Checking this box will remove this Member Candidate from the list. Proceed?`)
                setAct('removem')
                setRemoveMember(member)
                setShowModel(true)
                break
            case 'voteIn':
                // this case is not implemented yet.
                setModelContent (`Checking this box will make ${condidate[0]?.user.users.legalName} a member of this Pod.`)
                setAct('voteIn')
                setShowModel(true)
                break
            case 'voteOut':
                console.log("heresdsd")
                break
        }
    } 

    const actions = (member) => {
        // check if the pod is active or not
        if(!podInfo?.is_active){
            // check is the logged in user is delegate
            if(Is_delegate){
                // check if the podmember is one
                if(podMembers?.length === 1){
                    return (
                        <>
                        <span>
                            Dessolve Pod 
                            <input className='mx-2 form-check-input' type="checkbox" 
                            onChange={()=>handleModelShow('dessolvePod', '')} checked={showModel}/>
                        </span>
                        </>
                    )
                }else{
                    // if the podmember is one one and logged in user is a delegate; then remove the member
                    if(member?.is_delegate){
                        return ""
                    }else{
                        return (
                            <>
                                <input type="checkbox" 
                                className='form-check-input' 
                                checked={showModel}
                                onChange={()=>handleModelShow('removemember', member.id)} />
                            </>
                        )
                    }
                    return ""
                } //end of podmemeber being one
                
            }else{
                // check if user is this member
                if(member.user.username === AuthUser.username){
                    return (<>
                        Would you like to remain in this Pod?
                        <input type="checkbox" 
                        className='form-check-input mx-2' 
                        checked={true}
                        onChange={()=>handleModelShow('removemember', member.id)} />

                    </>)
                }else{
                    return ""
                }
            } //endof is_delegate

        }else{
            if(member.voteOuts.length > (members.length/2) && Is_delegate ){
               return (
                    <> majarity has voted him/her out. Would you remove him/her?
                        <input type="checkbox" 
                        className='form-check-input mx-2' 
                        checked={showModel}
                        onChange={()=>handleModelShow('removemember', member.id)} />
                    </>
                )
            }else{
                return ""
            }
        } //endof pod active
    }

    const handleVoteOut = (member)=>{
        // params required : member, voter , pod
        chatSocket.send(JSON.stringify({
            type: "voteOut",
            pod: podInfo.code,
            member: member.id,
            voter: AuthUser.username,
        }));
    }

    const handleDelegate =(member)=>{
        chatSocket.send(JSON.stringify({
            type: "delegate",
            pod: podInfo.code,
            recipient: member.id,
            voter: AuthUser.username,
        }));
        console.log('deleaged done/...')
    }

    const voteInsChck = (voteIns)=>{
        const vtrs = []
        voteIns.map(i => {
            vtrs.push(i.substring(0,5))
        })
        return !vtrs.includes(AuthUser.username)
    }

    const delegated = (putF) =>{
        const puts = []
        putF.map(i=>{
            puts.push(i.substring(0,5))
        })
        return puts.includes(AuthUser.username)
    }
    return (
        <div className="container">
            <Modal
                show={showModel}
                onHide={()=>handleModelClose()}
                backdrop="static"
                keyboard={false}>
                <Modal.Body> {modelContent} </Modal.Body>
                <Modal.Footer>
                    {act === 'dessolvePod'? 
                    <>
                    <Button variant="danger" onClick={()=>handleDesolve()}> Yes </Button>
                    <Button variant="secondary" onClick={()=>setShowModel(false)}> No </Button>
                    </>
                    :""}
                    {act === 'removem'? 
                    <>
                    <Button variant="danger" onClick={()=>handleRemove()}> proceed </Button>
                    <Button variant="secondary" onClick={()=>setShowModel(false)}> Cancel </Button>
                    </>
                    :""}
                    
                </Modal.Footer>
            </Modal>
            <div className="row">
                <div className="col-sm-12 col-md-3"></div>
                <div className="col-sm-12 col-md-6 mt-3">
                    <h1 className="text-center">House Keeping page</h1>
                    <h3 className='text-center'>pod: {podInfo?.district.code}-{podInfo?.code}</h3>
                    <h4 className='text-center'>Invitation Key: {podInfo?.invitation_code}</h4>
                    {Is_delegate? 
                    <button className='d-block mx-auto my-2 btn btn-success text-center' 
                        onClick={handleChngInvtKey}>Generate new key</button>
                    :null}
                    {podInfo?.is_active?
                        <p className='text-center'>Pod Status: ACTIVE!</p>
                    : null}
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
                            <th>{podInfo?.is_active? "Total Vote Out" :"Total"} </th>
                            <th>
                                {podInfo?.is_active? "Put forward as First Delegate" : null}
                            </th>
                            <th>{podInfo?.is_active? "Total": null}</th>
                            <th>Remove Member</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members?.length > 0 ? 
                         members?.map((member, index)=>(
                            <tr key={index} className="border">
                                <td>{index+1}</td>
                                <td>{member?.user.users.legalName} {member.is_delegate? 
                                    <span className='badge bg-primary'>del</span>
                                : null} </td>
                                <td>
                                   {podInfo?.is_active? <>
                                    Yes
                                    <input type="checkbox" 
                                    className='form-check-input mx-2'
                                    checked={voteInsChck(member?.voteOuts)}
                                    onChange={()=> handleVoteOut(member)}/>
                                   </>
                                   : null}
                                </td>
                                <td>{Is_delegate? podInfo?.is_active? member.voteOuts.length==0? "":member.voteOuts.length :null :null}</td>
                                <td> {podInfo?.is_active? <>
                                    Yes 
                                    <input type="checkbox" 
                                    className='form-check-input mx-2'
                                    checked={delegated(member?.putFarward)}
                                    onChange={()=> handleDelegate(member)}/>
                                </>:null}</td>
                                <td>{ podInfo?.is_active? member.putFarward.length==0? "":member.putFarward.length :null}</td>
                                <td>{actions(member)}</td>
                            </tr>
                        ))
                        : ""}
                        {condidate?.length > 0 ? 
                            <tr>
                                <td >01</td>
                                <td>{condidate[0]?.user.users.legalName}</td>
                                <td>
                                    {AuthUser.username === condidate[0].user.username? null :
                                        voted?.condidate === condidate[0].user.username? 
                                        voted?.voter === AuthUser.username? "voted":
                                        <>
                                        <label htmlFor="checkbox">YES</label>
                                        <input type="checkbox"  
                                            value={condidate[0].id} 
                                            onChange={handleVoteIn} 
                                            className ='mx-2 form-check-input' />
                                        </>
                                        :
                                        <>
                                        <label htmlFor="checkbox">YES</label>
                                        <input type="checkbox" 
                                            value={condidate[0].id} 
                                            onChange={handleVoteIn} 
                                            className ='mx-2 form-check-input' />
                                        </>
                                    }
                                
                                </td>
                                <td>
                                    {AuthUser.username === condidate[0]?.user.username? null: 
                                    Object.keys(voteCond).length
                                    }
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    {Is_delegate? 
                                    <input type = "checkbox" 
                                    className = 'form-check-input'
                                    checked = {showModel} 
                                    onChange = {()=>handleModelShow('removemember',condidate[0].id)} />
                                    :null}
                                </td>
                            </tr>
                        :""}
                    </tbody>
                </table>
            </div>
            {/* message status area */}
            <div className="row border p-3 shadow-sm">
                <p><strong>Status: </strong>{podInfo?.is_active? "This pod is active!"
                    :"This Pod will become active when it has six members."} 
                </p>
                {Is_delegate? 
                <>
                    {condidate?.length === 0 ? 
                    <p>There are no Member Candidates. Invite voters in your district to join by giving them a Pod Invitation Key.</p>
                    :
                    <p>There is a Member Candidate awaiting a majority vote of existing members.</p>
                    }
                    {members?.length >= 3 ? "":
                        <>
                        <p>Once you generate a new key, the old one will not work.</p>
                        <p>The creator of this Pod has been automatically made First Delegate. To elect a different First
                            Delegate, hold an election. Elections can be held when you have six or more members.
                        </p>
                        <p>Only the F-Del can dissolve a Pod, and may only do so when they are the only member left.</p>
                        </>
                    }
                </>
                :
                // check if the user is member or condidate
            // this check is for condidate throughing undefined exception
                condidate != undefined?
                    condidate[0]?.user.username === AuthUser.username ? 
                    <>
                        <p> You are a Member Candidate awaiting a majority vote of existing members.</p>
                        <p> You can wait to see if you are voted in, or you can contact the F-Del of this Pod IRL to discuss
                        being voted in.
                        </p>
                        <p> If you shouldn’t be trying to join this Pod for any reason, the F-Del can remove you as a
                        member candidate. After that happens, you will not be able to attempt to join this Pod unless
                        you are given a new Invitation Key. Ask your F-Del IRL.
                        </p>
                        <p> The creator of this Pod has been automatically made First Delegate. To elect a different First
                        Delegate, your Pod can hold an election. Elections can be held when you have six or more
                        members.
                        </p>
                        <p>Only the F-Del can dissolve a Pod, and may only do so when they are the only member left.</p>
                    </>
                    :
                    <>
                        <p>You are a member of the Pod.</p>
                        {condidate[0]? 
                        <p> There is a Member Candidate awaiting a majority vote of existing members. Check the Yes
                            box next to their name to vote them in. A running total of member votes for this candidate will
                            appear in the Total column. When a Candidate receives a majority of the votes of existing
                            members, they will automatically become a Member, and the voting will be ‘forgotten’ by the
                            database. </p>
                        :""}
                        
                        <p>
                        If you want someone to join this Pod, give them the PIK. Make sure it is the most recent
                        (currently valid) PIK generated by the F-Del. If you encounter any problems, please contact
                        the F-Del In Real Life, or ElseWhere On The Internet.
                        </p>
                        <p>Until this Pod becomes active, you can be removed by the F-Del at any time. </p>
                        <span>
                        After this Pod becomes active, you can only be removed by: 
                            <ol>
                                <li> Unchecking the Yes box next to ‘Would you like to remain in this Pod?’ </li>
                                <li> Being voted out by a majority of existing members. </li>
                            </ol>
                        </span>
                        <p>
                        Once a member is removed from a specific Pod, they cannot attempt to rejoin it without a new
                        Pod Invitation Key.
                        </p>
                        <p>
                        The creator of this Pod has been automatically made First Delegate. To elect a different First
                        Delegate, your Pod can hold an election. Elections can be held when you have six or more
                        members.
                        </p>
                        <p>Only the F-Del can dissolve a Pod, and may only do so when they are the only member left.</p>
                    </>
               : "nulllll"
                }
            </div>
            {/* helper links for delegate */}
            {Is_delegate? 
                <div className='row'>
                    <strong>Learn about:</strong>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">Active vs inactive Pods</Link>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">How to invite new members?</Link>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">How to hold a First Delegate Election?</Link>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">How to dissolve a Pod?</Link>
                </div>
            : 
            // helping links for pod members
            // this check is for condidate throughing undefined exception
            condidate != undefined?
                AuthUser.username === condidate[0]?.user.username ? null : 
                <div className='row'>
                    <strong>Learn about:</strong>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">Invite someone to join this Pod.</Link>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">Being removed from this Pod.</Link>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">Elect a new first Delegate.</Link>
                    <Link className='mx-3 text-secondary' to="/house-keeping-page">Pod Dessolution.</Link>
                </div>:""
            }
        </div>
    )
}

export default HouseKeeping