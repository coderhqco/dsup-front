import React, {useState, useEffect} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {authenticate} from '../store/userSlice';
import axios from 'axios';
import {baseURL} from '../store/conf'

function EnterTheFloor(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [district,    setDistrict]        = useState('');
    const [entry_code,  setEntry_code]      = useState('');
    const [password,    setPassword]        = useState('');
    const [token,       setToken]           = useState(''); 
    const [err,         setErr]             = useState('');
    
    // loging for user after the token[local state is changed.that means the token is generated.]
    useEffect(()=>{
        console.log("love: ",`${window.location.protocol}//${baseURL}/api/login/`)
        const loginURL = `${window.location.protocol}//${baseURL}/api/login/`;
        console.log("lgoinurl: ", loginURL)
        const login_params = {
            username:entry_code.toUpperCase(), 
            district: district.toUpperCase(), 
            password: password
        }
        console.log(login_params)
        let header = {'Authorization': `Bearer ${token.access}`}
        axios.post(loginURL, login_params, {headers:header})
        .then( response=>{
            if(response.status === 200){
                // set the user
                dispatch(authenticate({...response.data,token: token}));
                // nagivate to voter page...
                navigate('/voter-page');
            }else{
                setErr("Something went wrong. Check your inputs and try again.");
            }
        })
        .catch(error => {
            setErr("Something went wrong. Check your inputs and try again.");
            console.log(error)
        });
    }, [token])

    const handleSubmit = (e)=>{
        // generate the token here.
        const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/`;
        console.log("token url: ", TokenUrl)
        const token_params = {username:entry_code.toUpperCase(), password: password}
        axios.post(TokenUrl, token_params)
        .then(response =>{
            if(response.status === 200){
                setToken(response.data);
            }else{
                setErr("User not Found.");
            }
        })
        .catch(error => {
            setErr("Something went wrong. Check your inputs and try again.");
            console.log(error)
        });  
    
        e.preventDefault();
    }
    return (
        <div className="container">
            <h1 className="text-center mt-5">Enter The Floor</h1>
            <div className="row text-center ">
                <div className="col col-sm-12 ">
                    <p >If you haven't done so already, to Enter the Floor, you must first</p>  
                    <Link to='/claim-your-seat' className='btn btn-primary mb-3'>claim your Seat</Link>
                    <p >If you've already Claimed Your Seat, Enter the Floor:</p>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-4" ></div>
                    <div className="col col-sm-12 col-md-6 col-lg-4">
                        <form method="POST" noValidate>
                            <div className="row">
                                <div className="col">
                                    <label>District</label>
                                    <input className="form-control" value={district} onChange={(e)=> setDistrict(e.target.value)} maxLength="4"  placeholder="District" type="text" name="district"  />
                                    <span className="error text-danger hide" ></span>
                                </div>
                                <div className="col">
                                    <label>Entry Code</label>
                                    <input className="form-control" value={entry_code} onChange={(e)=> setEntry_code(e.target.value)} maxLength="5" placeholder="Entry code" type="text" name="userName" />
                                </div>
                            </div>
                            <br/>

                            <label >Password</label>
                            <input className="form-control" value={password} onChange={(e)=> setPassword(e.target.value)} type="password" name="password" id="password" />
                            
                            <br />
                            {err.length > 0 ? 
                            <p className='text-danger'>{err}</p>
                            : '' }
                            <br/>
                            <input type="submit" onClick={handleSubmit} name="commit" value="Enter the Floor" className="btn-xl btn btn-primary" data-disable-with="Enter the Floor" />
                        </form>  
                    </div>
                <div className="col-sm-12 col-md-3 col-lg-4"></div>
            </div>
        
            <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-4"></div>
                <div className="col-sm-12 col-md-6 col-lg-4"></div>
                <div className="col-sm-12 col-md-3 col-lg-4"></div>
            </div>
        </div>
    )
}

export default EnterTheFloor;