import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {database} from "../firebaseconfig";
import {get, push, ref, set, update, isEqual} from 'firebase/database';
import {createFilterOptions, TextField} from "@mui/material";
import {styled} from '@mui/material/styles';
import {Modal} from "react-bootstrap";
import AddEditClient from "./AddEditClient";
import MapComponent from "../Map";

const filter = createFilterOptions();

const clientLocationCollectionName = 'clientLocations'
const clientLocationRef = ref(database, clientLocationCollectionName)
const usersRef = ref(database, 'users');

function ClientLocationList({clientId}) {
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
                    let templatesArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    templatesArray = templatesArray
                        .filter(item => !item.isDeleted && item.clientId === clientId)
                        .map(value => {
                            value.clientType = "view"
                            value.lng = value.lang
                            return value
                        });
                    console.log("templatesArray => ", templatesArray)
                    setClients(templatesArray);
                }
            })
            .catch((error) => {
                setErrorMessage(`Error fetching User Profiles: ${error.message}`);
            });

    }

    useEffect(() => {
        /*async function getAllClients() {
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
        }*/

        getClientLocations()

    }, []);

    const _addClientLocation = () => {
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

    const _createOrUpdateLocation = async (clientLocation, index) => {
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
            location.clientId = clientId
            console.log("new client location =", location)
            const key = push(clientLocationRef).key;
            await set(ref(database, `${clientLocationCollectionName}/${key}`), location)
            getClientLocations()
        } else if (clientType === 'update') {
            console.log("update client location ", location)
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

    const _deleteClientLocation = async (client, index) => {
        await set(ref(database, `${clientLocationCollectionName}/${client.id}`), {
            ...client,
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
                        <h3 className="mb-4 rounded-pill px-5">Locations</h3>
                    </div>
                    <div className="d-flex flex-row justify-content-end mb-2">
                        <button className="btn-danger rounded-pill" onClick={_addClientLocation}>Add</button>
                    </div>
                    <div className="table-responsive">
                        <table className='w-100 table-bordered'>
                            <thead>
                            <tr>
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
                                            onClick={() => _createOrUpdateLocation(user, index)}>
                                            {isInEditMode(user) ? "Save" : "Edit"}
                                        </button>
                                        <button className="btn-danger rounded-pill"
                                                onClick={() => _deleteClientLocation(user, index)}>Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!clients.length && <div className="d-flex w-100 mt-4 justify-content-center">
                                <p className="text-warning">No location available</p>
                            </div>}
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
                    <AddEditClient/>
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

export default ClientLocationList;
