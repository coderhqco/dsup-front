import {useSelector} from 'react-redux';


function VoterPage(){
    const AuthUser = useSelector((state) => state.AuthUser.user);
    let date = new Date(AuthUser.date_joined)
    
    return (
        <div className="container">
             <div className="row">
                <div className="col">
                    {AuthUser.is_reg ? 
                    <div className="alert alert-warning mt-3">
                        <p>
                            You have to got until <span className='text-danger'>{date.toDateString()}</span>  to
                            registered to vote in your district or your account will be deleted! Yikes! 
                            <a href="#"> Learn More</a>. 
                        </p>
                        <p>
                            But, if you have gotten registered since the last time you entered the floor,
                            <a href="#"> click here</a>.  
                        </p>
                    </div>
                    :""}
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h1 className="text-center">Voter Page for {AuthUser.legalName}</h1>
                    <h3 className="text-center">Your Verification Score: {AuthUser.verificationScore}/7</h3>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <h1 className="text-center"> District: {AuthUser.district} </h1>
                </div>
            </div>

            {/* the three columns on  */}
            <div className="row">
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    <ul className="">
                        <li><a href="#">List of Delegates</a></li>
                        <li><a href="#">Back-and-Forth</a></li>
                        <li><a href="#">Member Contact Page</a></li>
                        <li><a href="#">Pod Housekeeping Page</a></li>
                    </ul>
                </div>
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    <div className="row text-center">
                        <div className="col-sm-12 ">
                            <a className="btn  btn-primary m-2" href="{% url 'joinPod' %}">Join a Pod</a>
                        </div>
                        <div className="col-sm-12 ">
                            <a className="btn btn-primary m-2" href="{% url 'createPod' %}">Create a Pod</a>
                        </div>
                    </div> 

                </div>
                <div className="col-sm-12 col-md-4 d-flex justify-content-center">
                    <ul className="">
                        <li><a href="#">First Link Meeting Schedule</a></li>
                        <li><a href="#">Meeting Minutes Log</a></li>
                        <li><a href="#">Bill Metrics</a></li>
                        <li><a href="#">Voter Settings</a></li>
                    </ul>
                </div>
            </div>
           
        </div>
    )
}
export default VoterPage;