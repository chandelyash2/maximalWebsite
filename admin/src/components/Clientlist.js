import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {database} from "../firebaseconfig";
import {get, push, ref, set, update, query, equalTo} from 'firebase/database';
import {Autocomplete, createFilterOptions, TextField} from "@mui/material";
import {styled} from '@mui/material/styles';
import {Modal} from "react-bootstrap";
import AddEditClient from "./AddEditClient";
import MapComponent from "../Map";
import FilterButton from "./FilterButton";


const usersRef = ref(database, 'users');

function ClientList() {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        get(usersRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let templatesArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    templatesArray = templatesArray
                        .filter(item => (!item.isDeleted && item.type === "Client"))
                        .filter(user => user.company);

                    setUsers(templatesArray);
                } else {
                    setErrorMessage('No User Profiles found');
                }
            })
            .catch((error) => {
                setErrorMessage(`Error fetching User Profiles: ${error.message}`);
            });
    }, []);

    const _addClient = () => {
        navigate('/Client');
    }

    const _deleteClient = (id) => {

    }

    const _editClient = (id) => {
        navigate(`/Client/${id}`);
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

                    <button className="btn-danger rounded-pill" onClick={_addClient}>Add Client</button>

                    <div className="table-responsive">
                        <table className='w-100 table-bordered'>
                            <thead>
                            <tr>
                                <th className='btn-danger rounded text-center'>
                                    First Name
                                    {/*<FilterButton
                                        options={nameOptions}
                                        value={selectedNames}
                                        onChange={setSelectedNames}
                                        users={users} // Pass users state to FilterButton
                                        setUsers={setUsers} // Pass setUsers function to FilterButton
                                    />*/}
                                </th>
                                <th className='btn-danger rounded text-center'>Last Name</th>
                                <th className='btn-danger rounded text-center'>Email</th>
                                <th className='btn-danger rounded text-center'>
                                    Company Name
                                    {/*<FilterButton
                                        options={companyNameOptions}
                                        value={selectedCompanyNames}
                                        onChange={setSelectedCompanyNames}
                                        users={users} // Pass users state to FilterButton
                                        setUsers={setUsers} // Pass setUsers function to FilterButton
                                    />*/}
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    Address
                                    {/*<FilterButton
                                        options={companyLocationOptions}
                                        value={selectedCompanyLocations}
                                        onChange={setSelectedCompanyLocations}
                                        users={users} // Pass users state to FilterButton
                                        setUsers={setUsers} // Pass setUsers function to FilterButton
                                    />*/}
                                </th>
                                <th className='btn-danger rounded text-center'>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.id} className=''>
                                    <td className='text-center'>{user.name}</td>
                                    <td className='text-center'>{user.lname}</td>
                                    <td className='text-start ps-2'>{user.email}</td>
                                    <td className='text-center'>{user.company}</td>
                                    <td className='text-center'>{user.companyAdress}</td>
                                    <td className='text-center'>
                                        <button className="btn btn-warning rounded-pill mx-1 text-center"
                                                title='Edit' onClick={() => _editClient(user.id)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-warning rounded-pill mx-1 text-center"
                                                title='Delete' onClick={() => _deleteClient(user.id)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </div>
            </div>

        </div>
    );
}

export default ClientList;
