import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";
import {baseURL} from '../store/conf'

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
        if(e.target.value.length >=7){
            if(passcheck(e.target.value)){
                setPassword(e.target.value)
                setPass_Err(false);
            }else{
                setPass_Err(true);
            }
        }else{
            setPass_Err(false)
        }
    }

    const handleConfirmPass = (e) =>{
        if(e.target.value === password){
            setConfirmPass(false);
            setPassword2(e.target.value);
        }else{
            setConfirmPass(true);
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
        const url =`${window.location.protocol}//${baseURL}/api/register`;
        axios.post(url,register_obj)
        .then(function (response) {
            console.log(response)
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

            <form onSubmit={(e)=>handleSubmit(e)} className="form-horizontal form-label-left mx-auto bg-light p-3 rounded-2 shadow-sm mb-3 ">
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
                        {is_formErr ? <p className="m-0 text-danger"> {formErr.legalName? formErr.legalName[0]:''}</p> : ''}
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
                               I believe i am eligible to vote in this district under the name and address 
                               i will provide below and i intend to register as a voter within 30 days.
                            </label>
                        </div>
                        <br/>

                        <label htmlFor="email" className="text-right">Email:</label>
                        <input type="email" 
                        onChange={(e)=>setEmail(e.target.value)}
                        className="form-control"  id="email" 
                        placeholder="enter your email"/>
                        {is_formErr ? <p className="m-0 text-danger"> {formErr.email ? 'Email already taken':''}</p> : ''}
                        <br/>

                        <label htmlFor="address" className="text-right">Address:</label>
                        <input type="text" 
                        className="form-control" 
                        onChange={(e)=>setAddress(e.target.value)}
                        id="address" placeholder="enter your address"/>
                        <br/>

                        <label htmlFor="password" className="text-right">Password:</label>
                        <input type="password" className="form-control" 
                        onChange={(e)=> handlePassword(e)}
                        id="password" placeholder="enter your a password"/>
                        {Pass_Err ? <p className="text-danger m-0">Your password is not valid</p> : ''}
                        <p className="m-0 fw-bold">Password Guidline:</p>
                        <ol>
                            <li>Is at least 8 characters long</li>
                            <li>Has at least one upper and lower case</li>
                            <li>Has at least one number</li>
                            <li>Has at least one special character such as: @,#,$...</li>
                        </ol>

                        <br/>
                        <label htmlFor="confirm_password" className="text-right">Confirm Password:</label>
                        <input type="password" className="form-control" 
                        onChange={(e)=> handleConfirmPass(e)}
                        id="confirm_password" placeholder="conform your password"/>
                        {confirmPass ? <p className="m-0 text-danger">Your password did not match.</p>: ''}
                        <br/>
                        
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
                             <input type="submit" value="Create my account" className="btn-primary btn" />
                            </div>
                        </div>
                    </div>
                </div> 
            </form>  
        </div>

    )
}

export default ClaimYourSeat;