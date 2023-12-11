const Candidate = ()=>{
    return (
        <table className='table table-bordered '> 
            <thead>
                <tr>
                    <th className='fw-bold'>#</th>
                    <th className='fw-bold'>Candidate Name</th>
                    <th className='fw-bold'>Do you want this voter to be a member?</th>
                    
                    {/**
                     * check if the auth user is delegate to this circle.
                     * 
                     * DO TO []
                    */}
                    <th className='fw-bold'>Remove Candidate</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>automatically</td>
                    <td> Yes 
                        <input 
                        type="checkbox" 
                        checked={false} 
                        onChange={()=>console.log("checking this means you vote for this candidate")}
                        className='form-check-input mx-3' />
                        
                        {/* vote counter */}
                        <span className="alert alert-primary p-0 px-2">1 votes</span>

                    </td>

                    {/* check if the auth user is delegate to this circle */}
                    <td>
                        Yes 
                        <input 
                        type="checkbox" 
                        checked={false} 
                        onChange={()=>console.log("checking this means you (ad delegate) want to remove this candidate")}
                        className='form-check-input mx-2' />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Candidate;