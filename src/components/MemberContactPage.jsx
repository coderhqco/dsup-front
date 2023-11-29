import React from "react";

function MemberContactPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-3"></div>
          <div className="col-sm-12 col-md-6 mt-3">
              {/* <div className="row">
                  <div class="alert alert-danger" role="alert"> </div>
              </div> */}
              <h1 className="text-center">Members Contant Page </h1>
              <h3 className='text-center'>Circle: 12321 District: NY01</h3>
          </div>
        <div className="col-sm-12 col-md-3"></div>
    </div>
    
    <div className="row mt-3">
      {/* make a table with columns of No, Legal Name, Address, Contact Info, Contact Rules */}
      <table className="table table-bordered">
        <thead>
            <tr>
              <th>No</th>
              <th>Legal Name</th>
              <th>Address</th>
              <th >Contact Information</th>
              <th>Contact Rules</th>
            </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Zaman Ehsani <span className="alert alert-primary p-0 px-2">Del</span></td>
            <td>A random address in U.S.A</td>
            <td> +1 32123223 <br /> info@democracystraightup.org </td>
            <td>
              <div className="container">
                <div className="row">
                  <textarea rows={2} placeholder="Please specify how/when members can reach you out. ">
                  </textarea>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Zaman Ehsani</td>
            <td>A random address in U.S.A</td>
            <td> +1 32123223 <br /> info@democracystraightup.org </td>
            <td>
              <div className="container">
                <div className="row">
                  <textarea rows={2} placeholder="Please specify how/when members can reach you out. ">
                  </textarea>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>Will Smith</td>
            <td>A random address in U.S.A</td>
            <td> +1 32123223 <br /> info@democracystraightup.org </td>
            <td>
              <div className="container">
                <div className="row">
                  <textarea rows={2} placeholder="Please specify how/when members can reach you out. ">
                  </textarea>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>Bill Gates</td>
            <td>A random address in U.S.A</td>
            <td> +1 32123223 <br /> info@democracystraightup.org </td>
            <td>
              <div className="container">
                <div className="row">
                  <textarea rows={2} placeholder="Please specify how/when members can reach you out. ">
                  </textarea>
                </div>
              </div>
            </td>
          </tr>
         
        </tbody>
      </table>

    </div>
    </div>
  )
}

export default MemberContactPage;