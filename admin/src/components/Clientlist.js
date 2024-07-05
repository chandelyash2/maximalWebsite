import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {database} from "../firebaseconfig";
import {get, push, ref, set, update,query,equalTo} from 'firebase/database';
import {Autocomplete, createFilterOptions, TextField} from "@mui/material";
import {styled} from '@mui/material/styles';
import {Modal} from "react-bootstrap";
import AddClient from "./AddClient";
import MapComponent from "../Map";

const filter = createFilterOptions();

const clientLocationCollectionName = 'clientLocations'
const clientLocationRef = ref(database, clientLocationCollectionName)
const usersRef = ref(database, 'users');

function ClientList() {
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClientIndex, setSelectedClientIndex] = useState(-1);
    const [marker, setMarker] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [openMap, setOpenMap] = useState(false);
    const initialized = useRef(false)

    async function getClientLocations() {
        get(clientLocationRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    console.log(data)
                    let templatesArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    templatesArray = templatesArray.filter(item => !item.isDeleted).map(user => {
                        const data = users.filter((item) => item.id === user.clientId)[0]
                        user.clientType = "view"
                        user.clientName = data.company
                        user.lng = user.lang
                        return user;
                    });
                    setClients(templatesArray);
                }
            })
            .catch((error) => {
                setErrorMessage(`Error fetching User Profiles: ${error.message}`);
            });
    }

    useEffect(() => {
        if (users.length > 0) {
            getClientLocations()
        }

    }, [users])

    useEffect(() => {
        async function getAllClients() {
            get(usersRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        let templatesArray = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));
                        templatesArray = templatesArray.filter(user =>
                            user.type === 'Client' && user.company
                        );
                        setUsers(templatesArray);
                    } else {
                        setErrorMessage('No User Profiles found');
                    }
                })
                .catch((error) => {
                    setErrorMessage(`Error fetching User Profiles: ${error.message}`);
                });
        }


        if (!initialized.current) {
            initialized.current = true
            getAllClients();
        }

    }, []);

    const _addClient = () => {
        const tempClients = [...clients]
        tempClients.push({
            id: new Date().getTime(),
            clientType: "new",
            clientName: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            lat: null, lng: null,
        })
        setClients(tempClients)
    }

    const _createOrUpdate = async (clientLocation, index) => {
        console.log("client => ", clientLocation)
        const clientType = clientLocation.clientType
        /*if (!clientLocation.clientId) {
            alert("Please select valid client")
            return
        }*/

        const location = {
            address: clientLocation.address,
            city: clientLocation.city,
            state: clientLocation.state,
            zipCode: clientLocation.zipCode,
            lat: clientLocation.lat,
            lang: clientLocation.lng,
        }
        if (clientType === 'new') {
            console.log("new client location")
            location.clientId = clientLocation.id
            const key = push(clientLocationRef).key;
            await set(ref(database, `${clientLocationCollectionName}/${key}`), location)
            getClientLocations()
        } else if (clientType === 'update') {
            console.log("update client location")
            await update(ref(database, `${clientLocationCollectionName}/${clientLocation.id}`), location)
            getClientLocations()
        } else if (clientType === 'view') {
            console.log("show save button here")
            const allLocations = [...clients]
            clientLocation.clientType = 'update'
            allLocations[index] = clientLocation
            setClients(allLocations)
        }
    }

    const _deleteClient = async (client, index) => {
        await update(ref(database, `${clientLocationCollectionName}/${client.id}`), {
            isDeleted: true,
        })
        const tempClients = [...clients]
        tempClients.splice(index, 1)
        setClients(tempClients)
    }

    const CustomTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            },
        },
        width: 150
    });

    const handleChange = (event, newValue, reason, user) => {
        console.log("handle called => ", reason)
        if (typeof newValue === 'string') {
            setShowModal(true)
            console.log("if")
        } else if (newValue && newValue.inputValue) {
            setShowModal(true)
            console.log("else if")
        } else {
            /*setValue(newValue);*/
            console.log("value => ", newValue)
            user.clientName = newValue.company
            user.id = newValue.id
            console.log("user => ", user)

        }
    };

    const isInEditMode = (user) => user.clientType === 'new' || user.clientType === 'update';

    const handleClose = (event, reason) => {
        console.log('Autocomplete closed ==>', reason);
        // Handle close event here
    };

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

                    <button className="btn-danger rounded-pill" onClick={_addClient}>Add</button>
                    <div className="table-responsive">
                        <table className='w-100 table-bordered'>
                            <thead>
                            <tr>
                                <th className='btn-danger rounded text-center'>
                                    Client Name
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    Street Address
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    City
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    State
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    Zip Code
                                </th>
                                <th className='btn-danger rounded text-center'>
                                    Location
                                </th>
                                <th className='btn-danger rounded text-center '>
                                    Action
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {clients.map((user, index) => (
                                <tr key={user.id}>
                                    <td className='text-center'>{!isInEditMode(user) ?
                                        user.clientName :
                                        <Autocomplete
                                            options={users}
                                            disableClearable
                                            freeSolo
                                            // filterSelectedOptions={true}
                                            // onClose={handleClose}
                                            defaultValue={user.clientName}
                                            getOptionLabel={(option) => {
                                                // option.company
                                                if (typeof option === 'string') {
                                                    return option;
                                                }
                                                // Add "xxx" option created dynamically
                                                if (option.inputValue) {
                                                    return option.inputValue;
                                                }
                                                // Regular option
                                                return option.company;
                                            }}
                                            onChange={(event, newValue, reason) => handleChange(event, newValue, reason, user)}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);

                                                if (params.inputValue !== '') {
                                                    filtered.push({
                                                        inputValue: params.inputValue,
                                                        company: `Add "${params.inputValue}"`,
                                                    });
                                                }

                                                return filtered;
                                            }}
                                            renderOption={(props, option) => {
                                                const {key, ...optionProps} = props;
                                                return (
                                                    <li key={key} {...optionProps}>
                                                        {option.company}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => <CustomTextField
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    type: 'search',
                                                }}/>
                                            }>
                                        </Autocomplete>
                                    }
                                    </td>
                                    <td className='text-center'>{!isInEditMode(user) ? user.address :
                                        <CustomTextField
                                            defaultValue={user.address}
                                            onChange={event => user.address = event.target.value}/>}
                                    </td>
                                    <td className='text-center'>{!isInEditMode(user) ? user.city :
                                        <CustomTextField defaultValue={user.city}
                                                         onChange={event => user.city = event.target.value}/>}</td>
                                    <td className='text-center'>{!isInEditMode(user) ? user.state :
                                        <CustomTextField defaultValue={user.state}
                                                         onChange={event => user.state = event.target.value}/>}</td>
                                    <td className='text-center'>{!isInEditMode(user) ? user.zipCode :
                                        <CustomTextField defaultValue={user.zipCode}
                                                         onChange={event => user.zipCode = event.target.value}/>}</td>
                                    <td className='text-center'>
                                        <button
                                            disabled={!isInEditMode(user)}
                                            className="btn-danger rounded-pill"
                                            onClick={() => {
                                                setSelectedClientIndex(index)
                                                setOpenMap(true)
                                            }}>
                                            Set
                                        </button>
                                        {(user.lat && user.lng) && `${Number(user.lat).toFixed(2)},${Number(user.lng).toFixed(2)}`}
                                    </td>
                                    <td className='text-center'>
                                        <button
                                            className="btn-danger rounded-pill"
                                            onClick={() => _createOrUpdate(user, index)}>
                                            {isInEditMode(user) ? "Save" : "Edit"}
                                        </button>
                                        <button className="btn-danger rounded-pill"
                                                onClick={() => _deleteClient(user, index)}>Delete
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
            {showModal && <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                dialogClassName="modal-md">
                <Modal.Header closeButton>
                    <Modal.Title>Add Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddClient/>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(false)}>
                        Create
                    </button>
                </Modal.Footer>
            </Modal>}

            {openMap && <Modal
                show={openMap}
                onHide={() => {
                    setSelectedClientIndex(-1)
                    setOpenMap(false)
                }}
                dialogClassName="modal-md">
                <Modal.Body>
                    <MapComponent onSubmit={(marker) => setMarker(marker)}/>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            const allClients = [...clients];
                            const selectedClient = allClients[selectedClientIndex];
                            selectedClient.lat = null
                            selectedClient.lng = null
                            setClients(allClients)
                            setSelectedClientIndex(-1)
                            setOpenMap(false)
                        }}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (selectedClientIndex > -1) {
                                const allClients = [...clients];
                                const selectedClient = allClients[selectedClientIndex];
                                selectedClient.lat = marker.lat
                                selectedClient.lng = marker.lng
                                setClients(allClients)

                            }
                            setOpenMap(false)
                        }}>
                        Set
                    </button>
                </Modal.Footer>
            </Modal>}
        </div>
    );
}

export default ClientList;
