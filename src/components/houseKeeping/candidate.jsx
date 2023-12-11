import {useState, useEffect} from 'react';

const Candidate = ({candidate, index, chatSocket})=>{
    const [voted, setVoted] = useState(false);

    useEffect(()=>{
        /** Check for the AuthUser if he/she voted in for this candidate */
        console.log("checking for votes of this candidate...")
    }, [])

    const VoteIn = ()=>{
        /** send the vote to the server */
        chatSocket.send(JSON.stringify({
            "mesage: ":"ilvoe you"
        }))
        
        setVoted(true);

        console.log("sending vote to the server...")
    }

    return (
        <tr>
        <td>{index+1}</td>
        <td>{candidate?.user?.users?.legalName}</td>
        <td> Yes 
            <input 
            type="checkbox" 
            checked={voted} 
            onChange={()=>VoteIn()}
            className='form-check-input mx-3' />
            
            {/* vote counter */}
            <span className="alert alert-primary p-0 px-2">1 votes</span>

        </td>

        {/* check if the auth user is delegate to this circle */}
        <td>
            Yes 
            <input 
            type="checkbox" 
            checked={false} 
            onChange={()=>console.log("checking this means you (ad delegate) want to remove this candidate")}
            className='form-check-input mx-2' />
        </td>
    </tr>
    )
}

export default Candidate;