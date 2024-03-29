import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'; 
import { useNavigate } from 'react-router-dom';  
import { auth } from '../firebaseconfig';  
import { getDatabase, ref, set, get } from 'firebase/database'; 
import { AlertContext } from './AlertContext';
import '../App.css';
import { countries as countryData } from 'country-data';
import { countries } from 'countries-list';


const UserProfile = () => {
  const { addAlert } = useContext(AlertContext);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    fathersName: '',
    dob: '',
    address: '',
    city: '',
    country: '',
    mobileNumber: '',
    idCardNumber: '',
  });

  const countriesWithCodes = countryData.all.filter(country => country.alpha2);

  const countryOptions = countriesWithCodes.map(country => ({
    value: country.alpha2,
    label: country.name,
    flag: `https://flagcdn.com/w40/${country.alpha2.toLowerCase()}.png`
  }));

  console.log(Object.values(countries));

  

    // Custom function to format the option label with the flag image
    const formatOptionLabel = ({ label, flag }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30px', height: '20px', marginRight: '10px', backgroundColor: flag ? 'transparent' : '#f0f0f0' }}>
          {flag && (
            <img 
              src={flag} 
              alt={`${label} Flag`} 
              style={{ width: '30px', height: '20px' }} 
              onError={(e) => {
                e.target.onerror = null; // Prevent future error triggers
                e.target.style.display = 'none'; // Hide the img element
              }} 
            />
          )}
        </div>
        {label}
      </div>
    );
    
    
  

  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const database = getDatabase();
    const userId = auth.currentUser.uid;
    const userProfileRef = ref(database, `users/${userId}/profile`);

    get(userProfileRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setProfileData(snapshot.val()); // Set the fetched data to state
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
        addAlert('Failed to fetch profile data.'); // Show error alert
      });

      if (profileData.country) {
        const matchedCountryOption = countryOptions.find(option => option.label === profileData.country);
        if (!matchedCountryOption) {
          // Handle the case where the country in the profile data doesn't match any option
          console.log("Country from profile data doesn't match any option.");
          // Set it to a default or handle as needed
        }
      }
  }, []); // Empty dependency array means this effect runs once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setProfileData(prevData => ({
      ...prevData,
      country: selectedOption.label
    }));
  };

  
  const addProfile = () => {
    const database = getDatabase(); // Get the Firebase database instance
    const userId = auth.currentUser.uid; // Assuming 'auth' is correctly initialized in 'firebaseconfig'
    const userProfileRef = ref(database, `users/${userId}/profile`); // Correct way to get a reference

    
    set(userProfileRef, profileData) // Use the 'set' function to save data
      .then(() => {
        console.log('Profile data saved successfully.');
        setSuccessMessage('Profile added successfully!');
        addAlert('Profile updated successfully!');
        setTimeout(() => {
          navigate('/'); // Navigate to home page after a short delay
        }, 2000); // 2 seconds delay
      })
      .catch((error) => {
        console.error('Error saving profile data:', error);
        addAlert('Error saving profile data:', error);
        setErrorMessage(`Error: ${error.message}`);
      });
  };

  return (
<div className="container mt-5">
  <div className='row justify-content-center'>
    <div className="col-md-6 border border-secondary rounded shadow py-3 px-5">
  <h3 className='text-center text-primary'>User Profile Form</h3>
  <hr/>
  <form>
  <div className="row">
      <div className="form-group col-md-6">
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          className="form-control"
          name="firstName"
          value={profileData.firstName}
          onChange={handleChange}
          id="firstName"
        />
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          className="form-control"
          name="lastName"
          value={profileData.lastName}
          onChange={handleChange}
          id="lastName"
        />
      </div>
    </div>
    <div className="row">
    <div className="form-group col-md-6">
      <label htmlFor="fathersName">Father's Name:</label>
      <input
        type="text"
        className="form-control"
        name="fathersName"
        value={profileData.fathersName}
        onChange={handleChange}
        id="fathersName"
      />
    </div>
    <div className="form-group col-md-6">
      <label htmlFor="fathersName">Date of Birth:</label>
      <input
        type="date"
        className="form-control"
        name="dob"
        value={profileData.dob}
        onChange={handleChange}
        id="dob"
      />
    </div>
    </div>

    <div className="form-group">
      <label htmlFor="address">Address:</label>
      <input
        type="text"
        className="form-control"
        name="address"
        value={profileData.address}
        onChange={handleChange}
        id="address"
      />
    </div>

    <div className="row">
    <div className="form-group col-md-6">
      <label htmlFor="city">City:</label>
      <input
        type="text"
        className="form-control"
        name="city"
        value={profileData.city}
        onChange={handleChange}
        id="city"
      />
    </div>

    <div className="form-group col-md-6">
    <label htmlFor="country">Country:</label>
    <Select
        options={countryOptions}
        formatOptionLabel={formatOptionLabel}
        onChange={handleCountryChange}
        value={countryOptions.find(option => option.label === profileData.country)} // Ensure this matches an option
        isSearchable
        name="country"
        id="country"
        className="basic-single"
        classNamePrefix="select"
      />
    </div>
    </div>

    <div className="form-group">
      <label htmlFor="mobileNumber">Mobile Number:</label>
      <input
        type="text"
        className="form-control"
        name="mobileNumber"
        value={profileData.mobileNumber}
        onChange={handleChange}
        id="mobileNumber"
      />
    </div>

    <div className="form-group">
      <label htmlFor="idCardNumber">ID Card Number:</label>
      <input
        type="text"
        className="form-control"
        name="idCardNumber"
        value={profileData.idCardNumber}
        onChange={handleChange}
        id="idCardNumber"
      />
    </div>

    {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

    <button type="button" className="btn btn-primary mt-3" onClick={addProfile}>
      Save Profile
    </button>
  </form>
</div>
</div>
  </div>
  );
};

export default UserProfile;
