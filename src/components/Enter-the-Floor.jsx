import React from 'react';
import {Link} from 'react-router-dom';

function EnterTheFloor(){
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
                            <label>District - Entry Code</label>
                            <div className="row">
                                <div className="col">
                                    <input className="form-control" maxLength="4"  placeholder="District" type="text" name="district"  />
                                    <span className="error text-danger hide" ></span>
                                </div>
                                <div className="col">
                                    <input className="form-control" maxLength="5" placeholder="Entry code" type="text" name="userName" />
                                </div>
                            </div>
                            <br/>

                            <label >Password</label>
                            <input className="form-control" type="password" name="password" id="password" />
                        
                            <div className="form-check">
                                <label className="checkbox inline" >
                                <input name="session[remember_me]" type="hidden" value="0" />
                                <input className="form-check-input" type="checkbox" value="1" name="session[remember_me]" id="session_remember_me" />
                                <span>Remember me on this computer</span>
                                </label>  
                            </div>
                            <br/><br/>
                            <input type="submit" name="commit" value="Enter the Floor" className="btn-xl btn btn-primary" data-disable-with="Enter the Floor" />
                        </form>  
                    </div>
                <div className="col-sm-12 col-md-3 col-lg-4"></div>
            </div>
        
            <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-4"></div>
                <div className="col-sm-12 col-md-6 col-lg-4">
                    {/* here put messages */}
                </div>
                <div className="col-sm-12 col-md-3 col-lg-4"></div>
            </div>
        </div>
    )
}

export default EnterTheFloor;