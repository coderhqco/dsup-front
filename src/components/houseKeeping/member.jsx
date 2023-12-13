import {useSelector } from 'react-redux';
import {useState, useEffect} from 'react';
import { baseURL } from '../../store/conf.js'
import axios from "axios";


const Member = ({member, index, chatSocket, fDel,podInfo, Iam_member, Iam_delegate}) => {
    const AuthUser  = useSelector((state) => state.AuthUser.user);
    const [voted_out, setVoted_out] = useState(false);

    useEffect(()=>{ 
        /** Check for the AuthUser if he/she voted in for this candidate */
        const Url = `${window.location.protocol}//${baseURL}/api/circle-vote-out-list/`;
        axios.get(Url, {params: { member: member.id} },
        {headers: { Authorization: `Bearer ${AuthUser.token.access}`}})
        .then(response=>{
            // checking whether the auth user has voted for this candidate
            response.data.map((res)=>{ if(res.voter == AuthUser.id){setVoted_out(true) }})
        })
        .catch(err=>console.log(err))
    },)


    const removeMember = ()=>{
        /** send the vote to the server */
        chatSocket.send(JSON.stringify({
            "action":"remove_candidate",
            "payload":{
                "remover": AuthUser.username,
                "candidate":member.id,
                "pod":member.pod.code,
            }
        }))
    }
    
    const voteOut = ()=>{
        console.log("voting out this member...")
        /** send the vote to the server */
        chatSocket.send(JSON.stringify({
            "action":"vote_out",
            "payload":{
                "voter": AuthUser.username,
                "member":member.id,
                "pod":member.pod.code,
            }
        }))
    }

    return (
        <tr>
            <td>{index+1}</td>
            <td> {member?.user?.users?.legalName}
                { member?.is_delegate ? <span className='alert alert-success p-0 px-2 mx-2'>F-Del</span>:null}
            </td>

            {podInfo?.is_active ? <>
                <th className='fw-bold'>Yes </th>
            </>:null}
             {/* if the pod is not active
             and the member is delegate
             then can he remove the member.
             otherwise, the members can vote out to remove.. */}

             {/* you can not not remove yourself. */}
             {member?.user?.username === AuthUser.username ? <td></td> :

                podInfo?.is_active === true ? 
                // if the user vote out this member
                <td> Yes 
                {!voted_out ? 
                        <input checked={voted_out}
                        onChange={()=>voteOut()}
                        type="checkbox"  
                        className='form-check-input mx-2' /> 
                    :null}
                    <span className="alert alert-primary p-0 px-2 mx-2">{member?.count_vote_out} votes</span>
                    </td>

                :
                // if the circle is not active and the auth user is the delegate. 
                // then he can remove the members.
                <td> 
                {Iam_delegate ? <>
                    <span> Yes </span>
                    <input checked={false}
                    onChange={()=>removeMember()}
                    type="checkbox"  
                    className='form-check-input mx-2' /> 
                </>
                :null}
                </td>
             }
    
        </tr>
    );

}
export default Member;