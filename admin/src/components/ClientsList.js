import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {database} from "../firebaseconfig";
import {get, ref, set} from 'firebase/database';


const clientLocations = 'clientLocations';
const clientLocationsRef = ref(database, clientLocations);

function ClientsList() {
    const [clients, setClients] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

    },[]);

    const _addClient = () => {

    }

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
                        <h3 className="btn btn-danger mb-4 rounded-pill px-5">Client List</h3>
                    </div>

                    <div className="d-flex flex-row justify-content-end mb-2">
                        <button className="btn-danger rounded-pill p-2 d-flex align-self-end" onClick={_addClient}>Add
                            Client
                        </button>
                    </div>

                    {/*<div className="table-responsive">
                        <table className='w-100 table-bordered'>
                            <thead>
                            <tr>
                                <th className='btn-danger rounded text-center'>
                                    First Name
                                    <FilterButton
                                        options={nameOptions}
                                        value={selectedNames}
                                        onChange={setSelectedNames}
                                        users={users} // Pass users state to FilterButton
                                        setUsers={setUsers} // Pass setUsers function to FilterButton
                                    />
                                </th>
                                <th className='btn-danger rounded text-center'>Last Name</th>
                                <th className='btn-danger rounded text-center'>Email</th>
                                <th className='btn-danger rounded text-center'>
                                    Company Name
                                    <FilterButton
                                        options={companyNameOptions}
                                        value={selectedCompanyNames}
                                        onChange={setSelectedCompanyNames}
                                        users={users} // Pass users state to FilterButton
                                        setUsers={setUsers} // Pass setUsers function to FilterButton
                                    />
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    Address
                                    <FilterButton
                                        options={companyLocationOptions}
                                        value={selectedCompanyLocations}
                                        onChange={setSelectedCompanyLocations}
                                        users={users} // Pass users state to FilterButton
                                        setUsers={setUsers} // Pass setUsers function to FilterButton
                                    />
                                </th>
                                <th className='btn-danger rounded text-center'>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className=''>
                                    <td className='text-center'>{user.firstName}</td>
                                    <td className='text-center'>{user.lastName}</td>
                                    <td className='text-start ps-2'>{user.email}</td>
                                    <td className='text-center'>{user.company}</td>
                                    <td className='text-center'>{user.streetAddress}</td>
                                    <td className='text-center'>
                                        <button className="btn btn-warning rounded-pill mx-1 text-center"
                                                title='Edit' onClick={() => _editClient(user.id)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-warning rounded-pill mx-1 text-center"
                                                title='Delete' onClick={() => _deleteClient(user, index)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>*/}

                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </div>
            </div>

        </div>
    );
}

export default ClientsList;
