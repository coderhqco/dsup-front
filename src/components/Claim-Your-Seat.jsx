import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";
import {baseURL} from '../store/conf.js'
import { Eye, EyeSlash } from 'react-bootstrap-icons';

function ClaimYourSeat(){
    const navigate = useNavigate();
    const [district, setDistrict] = useState('');
    const [legalName, setLegalName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [reg, setReg] = useState(true);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [confirmPass, setConfirmPass] = useState(false);
    const [submitStatus , setSubmitStatus] = useState(false);
    const [District_OK, setDistrict_OK] = useState(false);
    const [Pass_Err , setPass_Err] = useState(false);
    const [passwordType, setPasswordType]   = useState('password');    // show/hide password input
    const [passwordTypeConf, setPasswordTypeConf]   = useState('password'); // show/hide confirm password input

    const [formErr, setFormErr] = useState('');
    const [is_formErr, setIs_formErr] = useState(false);

    const handleCheck = (e)=>{
        //check weather the district is listed
        axios.get(`${window.location.protocol}//${baseURL}/api/districts/`)
        .then(function (response) {
            const is_listed_districts = response.data.find((i) => (i.code === district.toUpperCase()))
            if(is_listed_districts){
                // set the border of district input green
                setDistrict_OK(false);
            }else{
                // set the border of the district input red and show help text
                setDistrict_OK(true);
            }
        }); //endof then function
    }
    
    const handlePassword = (e) =>{
        setPassword(e)
        if(passcheck(e)){
            setPass_Err(false);
            setSubmitStatus(true);
        }else{
            setPass_Err(true);
            setSubmitStatus(false);
        }
    }

    const handleConfirmPass = (e) =>{
        setPassword2(e);
        if(e === password){
            setConfirmPass(true);
            setSubmitStatus(true);
        }else{
            setConfirmPass(false);
            setSubmitStatus(false);
        }
    }

    function passcheck(str){
        "Check password for min 8 char, upper and lower case, number, special character"
        const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const register_obj = {
            district: district,
            username: district,
            legalName: legalName,
            email: email,
            address: address,
            is_reg1: !reg,
            password: password,
            password2: password2 
        }
        const url =`${window.location.protocol}//${baseURL}/api/register/`;
        axios.post(url,register_obj)
        .then(function (response) {
            if(response.statusText === 'Created'){
                navigate('/sign-up')
            }
        })
        .catch((err)=>{
            setFormErr(err.response.data);
            setIs_formErr(true);
            // set this to an array
            // console.log(err.response.data.email?.[0])
            console.log("err: ", err)
        });
    }
    const changePassType = ()=>{
        passwordType === 'password' ? setPasswordType('') : setPasswordType('password'); 
    }
    const changePassTypeConfirm = ()=>{
        passwordTypeConf === 'password' ? setPasswordTypeConf('') : setPasswordTypeConf('password'); 
    }

    const generatePass = (e)=>{
        e.preventDefault()
        // this password could be wrong in a very rare case...
        const res = GenPass(8);

        setPassword(res);
        setPassword2(res);
        setConfirmPass(true);
        setPasswordType('')
        setPasswordTypeConf('')
    }
    function GenPass(length) {
        var result           = '';
        var characters       = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
  

    return (
        <div className="container p-3">
            <div className="text-center">
                <h1>Enter the Floor</h1>
                <p> If you've already claimed your seat,
                    you can enter the floor of your District Legislature (D-Leg).
                </p>
                <Link className="btn btn-xl btn-primary" to="/enter-the-floor" >Enter the Floor</Link>
               
                <p className="mt-3">Otherwise...</p>
                <h1>Claim Your Seat</h1>
                <p>Fill out the form below. <br/>
                    <strong>NOTE:</strong> Enter your district as your two-letter state postal code
                    followed by a two-digit number. For instance, 
                    the third district in Alabama would be AL03.
                </p>
            </div>

            <form onSubmit={(e)=>handleSubmit(e)} 
            className="form-horizontal form-label-left mx-auto bg-light p-3 rounded-2 shadow-sm mb-3 ">
                <div className="row d-flex justify-content-center">
                    <div className="col col-sm-12 col-md-6" id="big-font">
                        <label htmlFor="district" className="text-right">District:</label>
                        <input type="text" 
                        maxLength={4}
                        onChange={(e) => setDistrict(e.target.value)}
                        onBlur = {(e) => handleCheck(e)}
                        className={`form-control text-uppercase ${District_OK ? 'border border-2 border-danger': ''}`}
                        id="district" placeholder="enter your district"/>
                        {District_OK ? <p className="p-0 text-danger"> Please enter a valid district code. </p>: ''} 
                        <br/>

                        <label htmlFor="legalName" required ={true} className="text-right">Legal Name:</label>
                        <input type="text" 
                        onChange={(e)=> setLegalName(e.target.value)}
                        className="form-control" 
                        id="legalName" placeholder="enter your full name"/>
                        {is_formErr ? <p className="m-0 text-danger"> {formErr?.legalName? formErr?.legalName[0]:''}</p> : ''}
                        <br/>

                        <div className="form-check">
                            <input className="form-check-input"
                            onChange={()=> setReg(true)} 
                            checked = {reg}
                            type="radio" name="flexRadioDefault" 
                            id="flexRadioDefault2" />
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                I am legally registered to vote in this US congressional district.
                            </label>
                        </div>

                        <div className="form-check">
                            <input className="form-check-input"
                            onChange={()=> setReg(false)} 
                            type="radio" name="flexRadioDefault" 
                            id="flexRadioDefault1"/>
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                               I believe I am eligible to vote in this district under the name and address 
                               I will provide below and I intend to register as a voter within 30 days.
                            </label>
                        </div>
                        <br/>

                        <label htmlFor="email" className="text-right">Email:</label>
                        <input type="email" 
                        onChange={(e)=>setEmail(e.target.value)}
                        className="form-control"  id="email" 
                        placeholder="enter your email"/>
                        {is_formErr ? <p className="m-0 text-danger"> {formErr?.email ? 'Email already taken':''}</p> : ''}
                        <br/>

                        <label htmlFor="address" className="text-right">Address:</label>
                        <input type="text" 
                        className="form-control" 
                        onChange={(e)=>setAddress(e.target.value)}
                        id="address" placeholder="enter your address"/>
                        <br/>

                        <button className="btn btn-primary my-2" onClick={(e)=>generatePass(e)}>
                            Generate Password
                        </button>
                        <div className="input-group mb-3 border rounded">
                            <input className="form-control border-0" 
                            onChange={(e)=> handlePassword(e.target.value)}
                            type={passwordType} 
                            value={password}
                            placeholder="enter your a password"
                            name="password" 
                            id="password" />
                            <div className=" p-1 px-2 bg-white rounded">
                                {passwordType === 'password'?
                                <EyeSlash size="30" onClick={(e)=> changePassType()} />
                                : 
                                <Eye size="30" onClick={(e)=>changePassType()}/>
                                }
                            </div>
                        </div>

                        {Pass_Err && password.length > 0 ? <p className="text-danger m-0">Your password is not valid</p> : ''}
                        <p className="m-0 fw-bold">Password Guidline:</p>
                        <ol>
                            <li>Is at least 8 characters long</li>
                            <li>Has at least one upper and lower case</li>
                            <li>Has at least one number</li>
                            <li>Has at least one special character such as: @,#,$...</li>
                        </ol>

                        <br/>
                        <label htmlFor="confirm_password" className="text-right">Confirm Password:</label>
                        <div className="input-group mb-3 border rounded ">
                        <input 
                        type={passwordTypeConf} 
                        className="form-control border-0" 
                        onChange={(e)=> handleConfirmPass(e.target.value)}
                        value={password2}
                        id="confirm_password" 
                        placeholder="conform your password"/>
                            <div className=" p-1 px-2 bg-white rounded">
                                {passwordTypeConf === 'password'?
                                <EyeSlash size="30" onClick={(e)=> changePassTypeConfirm()} />
                                : 
                                <Eye size="30" onClick={(e)=>changePassTypeConfirm()}/>
                                }
                            </div>
                        </div>
                        {!confirmPass && password2.length>0 ? <p className="m-0 text-danger">Your password did not match.</p>: ''}
                      
                        
                        <div className="row">
                            <div className="col">
                                {is_formErr ? 
                                <div className="alert alert-danger">
                                    Error submiting the form
                                </div>
                                :''}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-center">
                             <input type="submit" 
                             disabled={submitStatus ? false : true }
                             value="Create my account" 
                             className="btn-primary btn" />
                            </div>
                        </div>
                    </div>
                </div> 
            </form>  
        </div>

    )
}

export default ClaimYourSeat;