import React, {useState, useEffect} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useDispatch} from 'react-redux';
import {authenticate} from '../store/userSlice.js';
import axios from 'axios';
import {baseURL} from '../store/conf.js'
import { Eye, EyeSlash } from 'react-bootstrap-icons';
function EnterTheFloor(){
    // const AuthUser = useSelector((state) => state.AuthUser.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [district,    setDistrict]        = useState('');
    const [passwordType, setPasswordType]   = useState('password');
    const [entry_code,  setEntry_code]      = useState('');
    const [password,    setPassword]        = useState('');
    const [token,       setToken]           = useState(''); 
    const [login,       setLogin]           = useState(false); 
    const [err,         setErr]             = useState('');
    
    // loging for user after the token[local state is changed.that means the token is generated.]
    useEffect(()=>{
        if(login){
            const loginURL = `${window.location.protocol}//${baseURL}/api/login/`;
            const login_params = {
                username:entry_code.toUpperCase(), 
                district: district.toUpperCase(), 
                password: password
            }
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

        }
    }, [token])

    // this function check if the token should be request. this is used to get new token to login
    function checkInputs(){
        if(district.length === 4 && entry_code.length === 5 && password.length > 0){
            return true
        }else{
            return false
        }
    }
    const handleSubmit = (e)=>{
        if(checkInputs){
            // generate the token here.
            const TokenUrl = `${window.location.protocol}//${baseURL}/api/token/`;
            const token_params = {username:entry_code.toUpperCase(), password: password}
            axios.post(TokenUrl, token_params)
            .then(response =>{
                if(response.status === 200){
                    setToken(response.data);
                    setLogin(true)
                }else{
                    setErr("User not Found.");
                }
            })
            .catch(error => {
                setErr("Something went wrong. Check your inputs and try again.");
                console.log(error)
            });  
        }
    
        e.preventDefault();
    }

    const changePassType = ()=>{
        passwordType === 'password' ? setPasswordType('') : setPasswordType('password'); 
    }
    return (
        <div className="container">
            <h1 className="text-center mt-5">Enter The Floor</h1>
            <div className="row text-center ">
                <div className="col col-sm-12 ">
                    <p >If you haven't done so already, to Enter the Floor, you must first</p>  
                    <Link to='/claim-your-seat' className='btn btn-primary mb-3'>Claim Your Seat</Link>
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
                                    <input className="form-control" 
                                    value={district} 
                                    onChange={(e)=> setDistrict(e.target.value.toUpperCase())} 
                                    maxLength="4"  
                                    style={{'textTransfer': 'uppercase'}}
                                    placeholder="District" 
                                    type="text" 
                                    name="district"  />

                                    <span className="error text-danger hide" ></span>
                                </div>
                                <div className="col">
                                    <label>Entry Code</label>
                                    <input className="form-control" 
                                    value={entry_code} 
                                    onChange={(e)=> setEntry_code(e.target.value.toUpperCase())} 
                                    maxLength="5" 
                                    placeholder="Entry code" 
                                    type="text" 
                                    name="userName" />
                                </div>
                            </div>
                            <br/>

                            <label >Password</label>
                            <div className="input-group mb-3 bg-gray border rounded">
                                <input className="form-control border-0" 
                                value={password} onChange={(e)=> setPassword(e.target.value)} 
                                type={passwordType} 
                                name="password" 
                                id="password" />

                                <div className=" p-1 px-2">
                                    {passwordType === 'password'?
                                    <EyeSlash size="30" onClick={(e)=> changePassType()} />
                                    : 
                                    <Eye size="30" onClick={(e)=>changePassType()}/>
                                    }
                                </div>
                            </div>
                            
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