import React, { useState, useEffect } from 'react';
import { ref, get, getDatabase } from 'firebase/database'; 
import { Link } from 'react-router-dom';

const ReportSelector = () => {
  const [reportNames, setReportNames] = useState([]);
  const [selectedReportName, setSelectedReportName] = useState('');

  useEffect(() => {
    const fetchReportNames = async () => {
      const db = getDatabase();
      const reportTemplatesRef = ref(db, 'reportTemplates');

      try {
        const snapshot = await get(reportTemplatesRef);
        if (snapshot.exists()) {
          const names = [];
          snapshot.forEach((childSnapshot) => {
            names.push(childSnapshot.key);
          });
          setReportNames(names);
        }
      } catch (error) {
        console.error('Error fetching report names:', error);
      }
    };

    fetchReportNames();
  }, []);

  return (
    <div>
      <h2>Select a Report</h2>
      <select value={selectedReportName} onChange={e => setSelectedReportName(e.target.value)}>
        <option value="">Select a report</option>
        {reportNames.map((name, index) => (
          <option key={index} value={name}>{name}</option>
        ))}
      </select>
      {selectedReportName && (
        <Link to={`/ReportGenerate/${selectedReportName}`}>
        <button>View Report</button>
        </Link>
      )}
    </div>
  );
};

export default ReportSelector;
