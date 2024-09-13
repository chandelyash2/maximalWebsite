import {Link, useParams} from "react-router-dom";
import React from "react";

const AddEditClient = (props) => {
    const {clientId} = useParams();

    return (
        <div className='container-fluid' style={{overflowY: 'auto'}}>
            <div className="row justify-content-center">
                <div className="ol-xl-10 col-lg-12 py-4"
                     style={{color: '#735744', maxHeight: '680px', overflowY: 'auto'}}>
                    <div className="text-center">
                        <Link to="/home">
                            <button className="btn btn-danger mb-4 rounded-pill px-5"><h3>ADMINISTRATOR PORTAL</h3>
                            </button>
                        </Link>
                    </div>

                    <div className="text-center">
                        <h3 className="btn btn-danger mb-4 rounded-pill px-5">
                            {clientId ? `Edit Client` : 'Add Client'}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddEditClient;
