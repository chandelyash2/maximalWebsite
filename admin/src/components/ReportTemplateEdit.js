import React, {useState, useEffect} from 'react';
import {ref, get, remove, push, set} from 'firebase/database';
import {database} from '../firebaseconfig';
import {Link} from 'react-router-dom';

function ReportTemplateEdit() {
    const [reportTemplates, setReportTemplates] = useState([]);
    const [selectedReportName, setSelectedReportName] = useState('');
    const [selectedCompanyName, setSelectedCompanyName] = useState('');
    const [selectedCompanyLocation, setSelectedCompanyLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const reportTemplatesRef = ref(database, 'reportTemplates');

        // Fetch data from Firebase Realtime Database
        get(reportTemplatesRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Convert the object of objects into an array of objects
                    const templatesArray = Object.keys(data)
                        .map(key => ({
                            id: key,
                            ...data[key]
                        }))
                        .filter(template => template.name && template.companyName && template.companyLocation);
                    setReportTemplates(templatesArray);
                } else {
                    setErrorMessage('No report templates found');
                }
            })
            .catch((error) => {
                setErrorMessage(`Error fetching report templates: ${error.message}`);
            });

    }, []); // Empty dependency array ensures that the effect runs only once on component mount

    const handleDelete = (templateId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this report template?");
        if (!isConfirmed) {
            return; // If user cancels, do nothing
        }
        const templateRef = ref(database, `reportTemplates/${templateId}`);
        // Remove the report template from Firebase Realtime Database
        remove(templateRef)
            .then(() => {
                // Filter out the deleted template from the state
                setReportTemplates(reportTemplates.filter(template => template.id !== templateId));
            })
            .catch((error) => {
                setErrorMessage(`Error deleting report template: ${error.message}`);
            });
    };

    const handleReplicate = async (templateId) => {
        const reportTempRef = push(ref(database, 'reportTemplates'));
        const newReportTempId = reportTempRef.key;
        const templateRef = ref(database, `reportTemplates/${templateId}`);
        try {
            // Retrieve the data from the source location
            const snapshot = await get(templateRef);

            if (snapshot.exists()) {
                // Data exists, get the value
                const data = snapshot.val();
                const newName = data.name + " copy";
                data.name = newName;
                // Reference to the destination location where you want to copy the data
                const newTemplateRef = ref(database, `reportTemplates/${newReportTempId}`);

                // Set the data to the destination location
                await set(newTemplateRef, data);
                setReportTemplates([...reportTemplates, {id: newReportTempId, ...data}]);
                // alert("Template Copies Succeffully ! ");
            } else {
                alert("Record does not exist!");
            }
        } catch (error) {
            alert("Error copying record:", error.message);
        }

    };

    // Filtered report templates based on selected options
    const filteredTemplates = reportTemplates.filter(template =>
        (!selectedReportName || template.name === selectedReportName) &&
        (!selectedCompanyName || template.companyName === selectedCompanyName) &&
        (!selectedCompanyLocation || template.companyLocation === selectedCompanyLocation)
    );

    return (
        <div className='container-fluid' style={{overflowY: 'auto'}}>
            <div className="row justify-content-center">
                <div className="col-xl-10 col-lg-12 py-4"
                     style={{color: '#735744', maxHeight: '680px', overflowY: 'auto'}}>
                    <div className="text-center">
                        <Link to="/home">
                            <button className="btn btn-danger mb-4  px-5 "><h3>ADMINISTRATOR PORTAL</h3></button>
                        </Link>
                    </div>
                    {/* Display select options for reportName, companyName, and companyLocation */}
                    <div className="mb-3">
                        <select id="reportName" className="form-select btn-danger  my-1 text-center w-25"
                                value={selectedReportName} onChange={(e) => setSelectedReportName(e.target.value)}>
                            <option value="">Choose Report Name...</option>
                            {[...new Set(reportTemplates.map(template => template.name))].map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <select id="companyName" className="form-select btn-danger  my-1 text-center w-25"
                                value={selectedCompanyName} onChange={(e) => setSelectedCompanyName(e.target.value)}>
                            <option value="">Choose Company Name...</option>
                            {[...new Set(reportTemplates.map(template => template.companyName))].map((companyName, index) => (
                                <option key={index} value={companyName}>{companyName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <select id="companyLocation" className="form-select btn-danger  my-1 text-center w-25"
                                value={selectedCompanyLocation}
                                onChange={(e) => setSelectedCompanyLocation(e.target.value)}>
                            <option value="">Choose Location...</option>
                            {[...new Set(reportTemplates.map(template => template.companyLocation))].map((companyLocation, index) => (
                                <option key={index} value={companyLocation}>{companyLocation}</option>
                            ))}
                        </select>
                    </div>

                    {/* Display filtered report templates in a Bootstrap table */}
                    <div className="table-responsive">
                        <table className='w-100 table-bordered'>
                            <thead>
                            <tr>
                                {/* <th className='btn-danger rounded text-center'>ID</th> */}
                                <th className='btn-danger  text-center'>Report Name</th>
                                <th className='btn-danger  text-center'>Company Name</th>
                                <th className='btn-danger  text-center'>Location</th>
                                <th className='btn-danger  text-center'>Action</th>
                                {/* Add additional table headers as needed */}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTemplates.map(template => (
                                <tr key={template.id} className=''>
                                    <td className='text-center'>{template.name}</td>
                                    <td className='text-center'>{template.companyName}</td>
                                    <td className='text-center'>{template.companyLocation}</td>
                                    <td className='text-center d-flex flex-columns justify-content-center'>
                                        <Link to={`/ReportCustomize/${template.id}`}
                                              className="btn btn-danger rounded-pill text-center" title='Edit'><i
                                            className="bi bi-pencil-square"></i></Link>
                                        <button className="btn btn-warning rounded-pill mx-1 text-center" title='Delete'
                                                onClick={() => handleDelete(template.id)}><i
                                            className="bi bi-trash3"></i></button>
                                        <button className="btn btn-danger rounded-pill text-center me-1"
                                                title='Replicate' onClick={() => handleReplicate(template.id)}><i
                                            class="bi bi-copy"></i></button>

                                        <Link to={`/ReportPreview/${template.id}`}
                                              className="btn btn-success rounded-pill text-center" title='Preview'>
                                            <i class="bi bi-printer"></i>
                                        </Link>
                                    </td>
                                    {/* Add additional table cells as needed */}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Display error message if any */}
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default ReportTemplateEdit;
