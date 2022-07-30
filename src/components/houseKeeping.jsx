import {useSelector,useDispatch} from 'react-redux';
// import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {pod,authenticate, addPodmMembers} from '../store/userSlice';

function HouseKeeping(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const pod = useSelector((state) => state.AuthUser.pod);
    const podMembers = useSelector((state) => state.AuthUser.podMembers);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState({})
    const dispatch = useDispatch();
    
    // this hooks updates the pod memebers after the token is set.
    useEffect(()=>{
        if(token.length > 0){
            const url = "http://127.0.0.1:8000/api/house-keeping/";
            const params = {pod: pod.code}
            let header = {'Authorization': `Bearer ${token}`}
            axios.post(url, params, {headers: header})
            .then(response => {
                if(response.status === 200){
                    dispatch(addPodmMembers(response.data.podMembers))
                }else{
                    setMessage({type:"alert alert-danger",msg:"could not get access token"})
                }
            })
            .catch(error => {
                setMessage({type:"alert alert-danger",msg:"something went wrong with your request"})
                console.log(error)
            });
        }
    },[token])

    // this hook gets the token
    useEffect(()=>{
        // from is tell weather the join btn is clicked on create pod
        const TokenUrl = "http://127.0.0.1:8000/api/token/refresh/";
        const token_params = {refresh: AuthUser.token.refresh}
        axios.post(TokenUrl, token_params)
        .then(response =>{
            if(response.status === 200){
                setToken(response.data.access);
            }else{
                setMessage({type:"alert alert-danger",msg:"could not get access token"})
            }
        })
        .catch(error => {
            console.log(error)
        })
    },[])

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
                <table className='table border'> 
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Member Name</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Removal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {podMembers?.map((member, index)=>(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{member.user.users.legalName}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                    {podMembers.length === 1 ? 
                                        <button className='btn btn-danger'>Desolve</button>
                                    :""}
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td>02</td>
                        <td>condidate member</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                        <input className='form-check-input' type="checkbox" />
                        </td>
                    </tr>
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