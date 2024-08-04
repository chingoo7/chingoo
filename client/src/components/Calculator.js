import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputForm from './InputForm';
import Chart from './Chart';

const Calculator = () => {
  const [data, setData] = useState({
    cashflowIncome: [],
    cashflowExpense: [],
    assets: [],
    liabilities: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveData = async (updatedData) => {
    try {
      await axios.post('/api/data', updatedData);
      setData(updatedData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const calculateNetWorth = () => {
    // Calculate net worth projection for 30 years
    const netWorthProjection = [];
    let currentAssets = data.assets.reduce((sum, asset) => sum + asset.value, 0);
    let currentLiabilities = data.liabilities.reduce((sum, liability) => sum + liability.value, 0);

    for (let year = 1; year <= 30; year++) {
      const yearlyIncome = data.cashflowIncome.reduce((sum, income) => sum + income.value, 0);
      const yearlyExpense = data.cashflowExpense.reduce((sum, expense) => sum + expense.value, 0);
      const yearlyNetCashflow = yearlyIncome - yearlyExpense;

      currentAssets *= (1 + data.assets.reduce((sum, asset) => sum + asset.growthRate, 0) / 100);
      currentLiabilities *= (1 + data.liabilities.reduce((sum, liability) => sum + liability.interestRate, 0) / 100);

      const netWorth = currentAssets - currentLiabilities + yearlyNetCashflow;
      netWorthProjection.push({ year, netWorth });
    }

    return netWorthProjection;
  };

  return (
    <div>
      <h1>Projection-based Calculator</h1>
      <InputForm data={data} onSave={saveData} />
      <Chart data={calculateNetWorth()} />
    </div>
  );
};

export default Calculator;
