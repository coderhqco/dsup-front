// import logo from './logo.svg';
import React from "react";
import monkey from './monkey.jpg';

class App extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="container">
        <div className="row"></div>
        <div className="row mt-5">
          <div className="col col-sm-12 col-md-8 col-lg-8">
            <div className="text-center ">
              <h1 className="m-4">Welcome to the Democracy Straight-Up Project!</h1>
              <div className="text-center">
                <h2 className="text-secondary m-4"> Vote directly on federal legislation. </h2>
                  <div className="row">
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <a className="btn btn-lg btn-primary m-3 text-decoration-none" href="/claim-your-seat">Claim Your Seat</a> 
                    </div>
                    <div className="col col-sm-12 col-md-6 col-lg-6">
                      <a className="btn btn-lg btn-primary m-3 text-decoration-none" href="/enter-the-floor">Enter the Floor</a>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <div className="col col-sm-12 col-md-4 col-lg-4 mt-5">
            <div className="container text-center ">
              <a href="https://rubyonrails.org/" className="mx-auto">
                <img src={monkey} 
                  className="mx-auto" 
                  alt="Head shot of chimpanzee stroking his chin as if mulling over a particularly tricky thought"/>
              </a>
            </div>
          </div>
        </div>  
      </div>
    );
  }
}

export default App;
