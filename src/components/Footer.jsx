import React from  'react';

class Footer extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <footer className='container'>
                <div className="row my-3">
                    <div className="col">
                        <p>The Democracy Straight-Up Project </p>
                    </div>
                    <div className="col text-end">
                        <a className='mx-3 text-secondary' href="#">About</a>
                        <a className='mx-3 text-secondary' href="#">Contact</a>
                        <a className='mx-3 text-secondary' href="#">News</a>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;