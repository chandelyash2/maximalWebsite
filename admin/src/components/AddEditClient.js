import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {GetCity, GetCountries, GetState,} from "react-country-state-city";
import * as Yup from 'yup';
import {auth, database} from '../firebaseconfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {get, ref, set, update} from "firebase/database";
import ClientLocationList from "./ClientLocationList";

const usersCollectionName = 'users';

const AddEditClient = (props) => {
    const {clientId} = useParams();
    const [client, setClient] = useState(null);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [countryId, setCountryId] = useState(0);
    const navigate = useNavigate();

    const _validateSchema = Yup.object({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().required('Email is required'),
        phone: Yup.string().required('Phone Number is required'),
        streetAddress: Yup.string().required('Street Address is required'),
        city: Yup.number().required('City is required').moreThan(0, 'City is required'),
        state: Yup.number().required('State is required').moreThan(0, 'State is required'),
        zipCode: Yup.string().required('Zip Code is required'),
        company: Yup.string().required('Company Name is required'),
        password: Yup.string().when('$clientId', {
            is: (clientId) => !clientId,
            then: (schema) => schema.required('Password is required'),
            otherwise: (schema) => schema.notRequired()
        }),
        confirmPassword: Yup.string().when('$clientId', {
            is: (clientId) => !clientId,
            then: (schema) => schema.required('Confirm Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            otherwise: (schema) => schema.notRequired()
        }),
    })

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            streetAddress: '',
            city: 0,
            state: 0,
            zipCode: '',
            company: '',
            type: 'Client',
            password: '',
            confirmPassword: '',
            status: true,
        },
        validationSchema: _validateSchema,
        validateOnMount: true,
        context: { clientId },
        onSubmit: values => {
            const stateName = stateList[values.state].name;
            const cityName = cityList[values.city].name;

            values.state = stateName
            values.city = cityName
            if (clientId) {
                // Update Client
                _updateClient(values)
            } else {
                // Add Client
                _createClient(values)
            }
        },
    })

    const _updateClient = async (values) => {
        console.log('Update Client => ', values)
        await update(ref(database, `${usersCollectionName}/${clientId}`), values)
        navigate(`/ClientList`);
    }

    const _createClient = async (values) => {
        console.log('Create Client => ', values)
        try {
            const createdUser = await createUserWithEmailAndPassword(auth, values.email, values.password);
            console.log('createdUser => ', createdUser)
            if (!createdUser) {
                console.log('Error creating user')
                return
            }
            const userId = createdUser.user.uid
            values.uid = userId
            await set(ref(database, `${usersCollectionName}/${userId}`), values)
            navigate(`/ClientList`);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Entered email is already in use.');
            } else {
                alert('An error occurred while creating client. Please try again later.');
            }
        }

    }

    useEffect(() => {
        GetCountries().then((result) => {
            const usa = result.find((country) => country.iso2 === 'US');
            setCountryId(usa.id);
            GetState(usa.id).then((result) => {
                result.splice(0, 0, {name: 'Select State', id: 0});
                setStateList(result);
            });
        });
        setCityList([{name: 'Select City', id: 0}]);

        if (clientId) {
            // Fetch Client
            get(ref(database, `${usersCollectionName}/${clientId}`)).then((snapshot) => {
                const client = snapshot.val()
                formik.setValues(client)
                setClient(client)
            })
        } else {
            _validateSchema.fields.password = Yup.string().required('Password is required')
            _validateSchema.fields.confirmPassword = Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
        }

    }, []);

    useEffect(() => {
        if (countryId && clientId && client && stateList) {
            const state = stateList.find((state) => state.name === client.state)
            if (state) {
                client.state = stateList.findIndex((state) => state.name === client.state)
                GetCity(countryId, state.id).then((result) => {
                    result.splice(0, 0, {name: 'Select City', id: 0});
                    setCityList(result);
                    client.city = result.findIndex((city) => city.name === client.city)
                })
            }
        }
    }, [client, countryId, stateList])

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

                    <form onSubmit={formik.handleSubmit}>
                        <div className="d-flex flex-column justify-content-center gap-2 mt-4">
                            <div className="d-flex flex-row gap-5">
                                <label htmlFor="firstName">
                                    First Name
                                    <input
                                        type="text"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="firstName"
                                        name="firstName"
                                        onChange={formik.handleChange}
                                        value={formik.values.firstName}
                                        placeholder="Enter First Name"
                                    />
                                    {formik.errors.firstName && formik.touched.firstName && (
                                        <div className="text-danger">{formik.errors.firstName}</div>
                                    )}
                                </label>
                                <label htmlFor="lastName">
                                    Last Name
                                    <input
                                        type="text"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="lastName"
                                        name="lastName"
                                        onChange={formik.handleChange}
                                        value={formik.values.lastName}
                                        placeholder="Enter Last Name"
                                    />
                                    {formik.errors.lastName && formik.touched.lastName && (
                                        <div className="text-danger">{formik.errors.lastName}</div>
                                    )}
                                </label>
                                <label htmlFor="company">
                                    Company Name
                                    <input
                                        type="text"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="company"
                                        name="company"
                                        onChange={formik.handleChange}
                                        value={formik.values.company}
                                        placeholder="Enter Company Name"
                                    />
                                    {formik.errors.company && formik.touched.company && (
                                        <div className="text-danger">{formik.errors.company}</div>
                                    )}
                                </label>
                            </div>
                            <div className="d-flex flex-row gap-5">
                                <label htmlFor="email">
                                    Email Address
                                    <input
                                        type="text"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="email"
                                        name="email"
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                        placeholder="Enter Email Address"
                                    />
                                    {formik.errors.email && formik.touched.email && (
                                        <div className="text-danger">{formik.errors.email}</div>
                                    )}
                                </label>
                                {!clientId && <label htmlFor="password">
                                    Password
                                    <input
                                        type="password"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        maxLength={10}
                                        id="password"
                                        name="password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        placeholder="Enter Password"
                                    />
                                    {formik.errors.password && formik.touched.password && (
                                        <div className="text-danger">{formik.errors.password}</div>
                                    )}
                                </label>}
                                {!clientId && <label htmlFor="confirmPassword">
                                    Confirm Password
                                    <input
                                        type="password"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onChange={formik.handleChange}
                                        value={formik.values.confirmPassword}
                                        placeholder="Enter Confirm Password"
                                    />
                                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                        <div className="text-danger">{formik.errors.confirmPassword}</div>
                                    )}
                                </label>}
                            </div>
                            <div className="d-flex flex-row gap-5">
                                <label htmlFor="phone">
                                    Phone Number
                                    <input
                                        type="tel"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        maxLength={10}
                                        id="phone"
                                        name="phone"
                                        onChange={formik.handleChange}
                                        value={formik.values.phone}
                                        placeholder="Enter Phone Number"
                                    />
                                    {formik.errors.phone && formik.touched.phone && (
                                        <div className="text-danger">{formik.errors.phone}</div>
                                    )}
                                </label>
                                <label htmlFor="streetAddress" style={{width: '450px'}}>
                                    Street Address
                                    <input
                                        type="text"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="streetAddress"
                                        name="streetAddress"
                                        onChange={formik.handleChange}
                                        value={formik.values.streetAddress}
                                        placeholder="Enter Street Address"
                                    />
                                    {formik.errors.streetAddress && formik.touched.streetAddress && (
                                        <div className="text-danger">{formik.errors.streetAddress}</div>
                                    )}
                                </label>
                            </div>
                            <div className="d-flex flex-row gap-5">
                                <label htmlFor="state" style={{width: '200px'}}>
                                    State
                                    <select
                                        id="state"
                                        name="state"
                                        className="form-control w-100 btn-danger text-center rounded-pill mt-2"
                                        onChange={(e) => {
                                            const state = stateList[e.target.value]
                                            setCityList([{name: 'Select City', id: 0}]);
                                            formik.values.city = 0;
                                            GetCity(countryId, state.id).then((result) => {
                                                result.splice(0, 0, {name: 'Select City', id: 0});
                                                setCityList(result);
                                            })
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.state}
                                    >
                                        {stateList.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.errors.state && formik.touched.state && (
                                        <div className="text-danger">{formik.errors.state}</div>
                                    )}
                                </label>
                                <label htmlFor="city" style={{width: '200px'}}>
                                    City
                                    <select
                                        id="city"
                                        name="city"
                                        className="form-control w-100 btn-danger text-center rounded-pill mt-2"
                                        onChange={formik.handleChange}
                                        value={formik.values.city}
                                    >
                                        {cityList.map((item, index) => (
                                            <option key={index} value={index}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.errors.city && formik.touched.city && (
                                        <div className="text-danger">{formik.errors.city}</div>
                                    )}
                                </label>
                                <label htmlFor="zipCode">
                                    Zip Code
                                    <input
                                        type="number"
                                        className="form-control w-100 btn-danger text-center m-auto rounded-pill mt-2"
                                        id="zipCode"
                                        name="zipCode"
                                        maxLength={5}
                                        onChange={formik.handleChange}
                                        value={formik.values.zipCode}
                                        placeholder="Enter Zip Code"
                                    />
                                    {formik.errors.zipCode && formik.touched.zipCode && (
                                        <div className="text-danger">{formik.errors.zipCode}</div>
                                    )}
                                </label>
                            </div>
                            <div className="d-flex w-100 mt-4 justify-content-center">
                                <button
                                    className="btn btn-primary text-white rounded-2xl"
                                    type="submit">
                                    {clientId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {clientId && <div className="d-flex w-100 mt-4 justify-content-center">
                        <ClientLocationList clientId={clientId}/>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default AddEditClient;
