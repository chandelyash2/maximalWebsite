import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function Unauthorised() {

  return (
    <div className="container mt-5" data-aos="flip-right">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-8">
          <div className="card">
            <div className="card-header  text-center text-white">
              <div>
                <a href="https://maximalsecurityservices.com">
                 <img src="/images/logo.png" className="w-50"/>
                 </a>
              </div>
            </div>
            <div className="card-body">
            
                <div className="alert alert-danger my-4" role="alert">
                  Un-Ahtorised Access by Non Admin.
                </div>
   
            <h3 className='text-danger'>Sorry! You're not Authorised Admin !!! Unauthorised Access to this App make be subject to legal action !!! Please close this link !!! </h3>
               </div>
            </div>
          </div>
        </div>
      </div>
  );
}
    export default Unauthorised;
