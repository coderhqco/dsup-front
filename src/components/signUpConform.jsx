import check from '../check.png';
import '../index.css';

function SignUpConfirm(){
    return (
        <div className="container my-auto">
            <h3 className="text-success text-center">Almost there... </h3>
            <div className="col-sm-12">
                <div className="alert alert-success" >
                    <div className="image_check">
                        <img src={check} alt="check"/> 
                    </div>
                        <p className="my-2 text-center"> We've sent an email to the address you provided. <br />
                        Open it and click on the link to confirm and Enter the Floor. </p> 
                </div>
            </div>
        </div>
    )
}

export default SignUpConfirm;