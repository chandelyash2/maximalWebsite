import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {database} from "../firebaseconfig";
import {get, push, ref, set, update} from 'firebase/database';
import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';
import {GetCountries, GetState,} from "react-country-state-city";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Modal} from "react-bootstrap";
import MapComponent from "../Map";

const clientLocations = 'clientLocations';
const clientLocationsRef = ref(database, clientLocations);
const filter = createFilterOptions();

function ClientsList() {
    const [clients, setClients] = useState([]);
    const [uniqueClients, setUniqueClients] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [openMap, setOpenMap] = useState(false);
    const [marker, setMarker] = useState(null);
    const [selectedClientIndex, setSelectedClientIndex] = useState(-1);

    useEffect(() => {
        getClientLocations()

        GetCountries().then((result) => {
            const usa = result.find((country) => country.iso2 === 'US');
            GetState(usa.id).then((result) => {
                setStateList(result);
            });
        });
    }, []);

    const getClientLocations = async () => {
        get(clientLocationsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let templatesArray = Object.keys(data)
                        .map(key => ({
                            id: key,
                            ...data[key]
                        }))
                        .filter(item => !item.isDeleted && item.clientName)
                        .map(value => {
                            return {
                                ...value,
                                clientType: "view",
                                lng: value.lang,
                            }
                        });
                    setClients(templatesArray);

                    let uniqueClientNames = new Set();
                    templatesArray.filter(item => {
                        if (uniqueClientNames.has(item.clientName)) {
                            return false;
                        } else {
                            uniqueClientNames.add(item.clientName);
                            return true;
                        }
                    });
                    uniqueClientNames = Array.from(uniqueClientNames).map(item => {
                        return {
                            title: item
                        }
                    })
                    setUniqueClients(uniqueClientNames)
                }
            })
    }

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

    const isInEditMode = (user) => user.clientType === 'new' || user.clientType === 'update';

    const CustomTextField = styled(TextField)({
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none',
            },
        },
        width: 150
    });

    const _createOrUpdateLocation = async (clientLocation, index) => {
        const clientType = clientLocation.clientType

        const location = {
            address: clientLocation.address,
            city: clientLocation.city,
            state: clientLocation.state,
            zipCode: clientLocation.zipCode,
            lat: clientLocation.lat,
            lang: clientLocation.lng,
            clientName: clientLocation.clientName
        }

        if (clientType === 'new') {
            console.log("new client location =", location)
            const key = push(clientLocationsRef).key;
            await set(ref(database, `${clientLocations}/${key}`), location)
            await getClientLocations()
        } else if (clientType === 'update') {
            console.log("update client location ", location)
            await update(ref(database, `${clientLocations}/${clientLocation.id}`), location)
            await getClientLocations()
        } else if (clientType === 'view') {
            console.log("show save button here")
            const allLocations = [...clients]
            clientLocation.clientType = 'update'
            allLocations[index] = clientLocation
            setClients(allLocations)
        }
    }

    const _deleteClientLocation = async (client, index) => {
        await set(ref(database, `${clientLocations}/${client.id}`), {
            ...client,
            isDeleted: true,
        })
        const tempClients = [...clients]
        tempClients.splice(index, 1)
        setClients(tempClients)
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
                        <button className="btn-danger rounded-pill p-2 d-flex align-self-end" onClick={_addClient}>
                            Add
                        </button>
                    </div>

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
                                {/*<th className='btn-danger rounded text-center'>
                                    Location
                                </th>*/}
                                <th className='btn-danger rounded text-center '>
                                    Action
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {clients.map((user, index) => (
                                <tr key={user.id}>
                                    <td className='text-center'>{!isInEditMode(user) ? user.clientName :
                                        <Autocomplete
                                            className={'w-100'}
                                            value={user.clientName}
                                            onChange={(event, newValue) => {
                                                const tempClients = [...clients];
                                                const client = tempClients[index];
                                                if (typeof newValue === 'string') {
                                                    client.clientName = newValue;
                                                } else if (newValue && newValue.inputValue) {
                                                    client.clientName = newValue.inputValue;
                                                } else {
                                                    client.clientName = newValue;
                                                }
                                                setClients(tempClients);
                                            }}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);

                                                const {inputValue} = params;
                                                // Suggest the creation of a new value
                                                const isExisting = options.some((option) => inputValue === option.title);
                                                if (inputValue !== '' && !isExisting) {
                                                    filtered.push({
                                                        inputValue,
                                                        title: `Add "${inputValue}"`,
                                                    });
                                                }

                                                return filtered;
                                            }}
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            id="free-solo-with-text-demo"
                                            options={uniqueClients}
                                            getOptionLabel={(option) => {
                                                if (typeof option === 'string') {
                                                    return option;
                                                }
                                                if (option.inputValue) {
                                                    return option.inputValue;
                                                }
                                                return option.title;
                                            }}
                                            renderOption={(props, option) => {
                                                const {key, ...optionProps} = props;
                                                return (
                                                    <li key={key} {...optionProps}>
                                                        {option.title}
                                                    </li>
                                                );
                                            }}
                                            freeSolo
                                            renderInput={(params) => (
                                                <CustomTextField {...params} defaultValue={user.clientName}/>
                                            )}/>}
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
                                        <Select
                                            value={user.state}
                                            style={{width: 150}}
                                            onChange={(event) => {
                                                const tempClients = [...clients];
                                                const client = tempClients[index];
                                                client.state = event.target.value
                                                setClients(tempClients);
                                            }}
                                            disableUnderline={true}
                                            variant="standard">
                                            {stateList.map((item, index) => (
                                                <MenuItem key={index} value={item.name}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    }</td>
                                    <td className='text-center'>{!isInEditMode(user) ? user.zipCode :
                                        <CustomTextField defaultValue={user.zipCode}
                                                         onChange={event => user.zipCode = event.target.value}/>
                                    }</td>
                                    {/*<td className='text-center'>
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
                                    </td>*/}
                                    <td className='text-center'>
                                        <button
                                            className="btn-danger rounded-pill"
                                            onClick={() => _createOrUpdateLocation(user, index)}>
                                            {isInEditMode(user) ? "Save" : "Edit"}
                                        </button>
                                        <button className="btn-danger rounded-pill"
                                                onClick={() => _deleteClientLocation(user, index)}>
                                            Delete
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

export default ClientsList;
