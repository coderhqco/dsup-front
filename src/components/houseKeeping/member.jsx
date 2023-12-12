import {useSelector } from 'react-redux';
import {useState, useEffect} from 'react';

const Member = ({member, index, fDel}) => {
    const AuthUser  = useSelector((state) => state.AuthUser.user);
    
    return (
        <tr>
            <td>{index+1}</td>
            <td> {member?.user?.users?.legalName}
            {fDel?.user?.username === member?.user?.username? 
                <span className='alert alert-success p-0 px-2 mx-2'>F-Del</span>
            :null}
             </td>
            <td>  
                Yes 
                <input checked={false}
                onChange={()=>console.log("checking this means you vote to remove this member")}
                type="checkbox"  
                className='form-check-input mx-2' /> 

                {/* vote counter */}
                <span className="alert alert-primary p-0 px-2">{member?.count_vote_out} votes</span>
            </td>
        </tr>
    );

}
export default Member;