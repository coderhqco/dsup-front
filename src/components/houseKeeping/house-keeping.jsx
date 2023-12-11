import {useSelector,useDispatch, } from 'react-redux';
import {useNavigate,Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {authenticate,pod, addPodmMembers, desolvePod} from '../../store/userSlice.js';
import Member from './member.jsx'
import Candidate  from './candidate.jsx';

function HouseKeeping(){
    const AuthUser      = useSelector((state) => state.AuthUser.user);
    const podInfo       = useSelector((state) => state.AuthUser.pod);
    const podMembers    = useSelector((state) => state.AuthUser.podMembers);

    const [err, setErr] = useState('');
    const dispatch      = useDispatch();
    const navigate      = useNavigate();

    // saparetes the condidates and members
    const [condidate, setCondidate]   = useState('')
    const [members, setMembers]       = useState('')

    let ws_schame = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${ws_schame}://${process.env.REACT_APP_BASE_URL}/circle/${podInfo?.code}/${AuthUser.username}/`
    const chatSocket = new WebSocket(url);

    useEffect(()=>{
        // get back the messages...
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log(data)
            if(data.type){
                switch(data.type){  }

            } //end of if(data.type)
        };

        // what happens on closing the connection
        chatSocket.onclose = function(e) { setErr("live connection is closed. Please refresh your page!")};


        // close the connection on page leave. cleanup function
        return () => {
            /**
             * 1. close the connection
             * 2. clear the states
             * 3. terminate any functions in running or in background 
             */
            console.log("closing the connection")
        }
    },[])


    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 col-md-3"></div>
                <div className="col-sm-12 col-md-6 mt-3">
                    <div className="row">
                        { err ? <div className="alert alert-danger" role="alert">{err} </div>:null}
                    </div>
                    <h1 className="text-center">Housekeeping Page</h1>
                    <h3 className='text-center'>Circle: {podInfo?.code} District: {podInfo?.district.code}</h3>
                    <h4 className='text-center'>Invitation Key: {podInfo?.invitation_code}</h4>
                    <button className='d-block mx-auto my-2 btn btn-success text-center' 
                        onClick={()=>console.log("check for being delegate!")}>Generate new key</button>

                    {podInfo?.is_active?
                        <p className='text-center'>Circle Status: ACTIVE!</p>
                    : null}
                </div>
                <div className="col-sm-12 col-md-3"></div>
            </div>
            <div className="row">
                <table className='table table-bordered '> 
                    <thead>
                        <tr>
                            <th className='fw-bold'>#</th>
                            <th className='fw-bold'>Member Name</th>
                            {podInfo?.is_active ? <>
                                <th className='fw-bold'>Put forward as First Delegate</th>
                            </>:null}

                            <th className='fw-bold'>Remove Member</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Member></Member>
                    </tbody>
                </table>

                
                {/* candidate list table */}
                <p className='py-0 my-0 mt-2'>Candidate waiting for votes:</p>
                <Candidate>

                </Candidate>
            </div>

        </div>
    )
}

export default HouseKeeping