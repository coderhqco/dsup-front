
const Member = () => {
    return (
        <tr>
            <td>1</td>
            <td> Ali lover </td>
            <td>  
                Yes 
                <input checked={false}
                onChange={()=>console.log("checking this means you vote to remove this member")}
                type="checkbox"  
                className='form-check-input mx-2' /> 

                {/* vote counter */}
                <span className="alert alert-primary p-0 px-2">2 votes</span>
            </td>
        </tr>
    );

}
export default Member;