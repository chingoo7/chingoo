import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CashflowSection from './CashflowSection';
import AssetsLiabilitiesSection from './AssetsLiabilitiesSection';
import NetWorthProjection from './NetWorthProjection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ParentComponent() {
  const [userData, setUserData] = useState({
    incomeCashflow: [],
    expensesCashflow: [],
    assets: [],
    liabilities: []
  });

  // Fetch initial data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, test the CORS configuration
        const testResponse = await axios.get(`${API_URL}/api/test`);
        console.log('CORS Test Response:', testResponse.data);

        // If CORS test passes, fetch the actual data
        const response = await axios.get(`${API_URL}/api/userdata`, {
          withCredentials: true // Include credentials if using cookies
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
      }
    };

    fetchData();
  }, []);

  // Function to update user data
  const updateUserData = async (updater) => {
    try {
      const newData = typeof updater === 'function' ? updater(userData) : { ...userData, ...updater };
      console.log('Updating user data:', newData);

      const response = await axios.put(`${API_URL}/api/userdata`, newData, {
        withCredentials: true // Include credentials if using cookies
      });
      setUserData(response.data);
      console.log('Updated user data:', response.data);
    } catch (error) {
      console.error('Error updating user data:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
    }
  };

  return (
    <div>
      <CashflowSection
        incomeCashflow={userData.incomeCashflow}
        expensesCashflow={userData.expensesCashflow}
        updateUserData={updateUserData}
      />
      <AssetsLiabilitiesSection
        assets={userData.assets}
        liabilities={userData.liabilities}
        updateUserData={updateUserData}
      />
      <NetWorthProjection userData={userData} />
    </div>
  );
}

export default ParentComponent;