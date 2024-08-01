import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Line } from 'react-chartjs-2';

const Calculator = () => {
  const [calculatorData, setCalculatorData] = useState({
    cashflowIncome: [],
    cashflowExpense: [],
    assets: [],
    liabilities: []
  });
  const [projections, setProjections] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    calculateProjections();
  }, [calculatorData]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/calculator');
      setCalculatorData(response.data || {
        cashflowIncome: [],
        cashflowExpense: [],
        assets: [],
        liabilities: []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveData = async () => {
    try {
      await axios.post('http://localhost:5000/api/calculator', calculatorData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleInputChange = (category, index, field, value) => {
    const updatedData = { ...calculatorData };
    updatedData[category][index][field] = value;
    setCalculatorData(updatedData);
    saveData();
  };

  const addItem = (category) => {
    const updatedData = { ...calculatorData };
    const newItem = { label: '', amount: 0 };
    if (category === 'assets') {
      newItem.growthRate = 0;
      } else if (category === 'liabilities') {
        newItem.interestRate = 0;
      }
      updatedData[category].push(newItem);
      setCalculatorData(updatedData);
      saveData();
    };
  
    const calculateProjections = () => {
      const years = 30;
      let projections = [];
  
      for (let year = 0; year <= years; year++) {
        let netWorth = 0;
        let yearlyIncome = calculatorData.cashflowIncome.reduce((sum, item) => sum + Number(item.amount), 0);
        let yearlyExpense = calculatorData.cashflowExpense.reduce((sum, item) => sum + Number(item.amount), 0);
  
        calculatorData.assets.forEach(asset => {
          const growthRate = 1 + Number(asset.growthRate) / 100;
          netWorth += Number(asset.amount) * Math.pow(growthRate, year);
        });
  
        calculatorData.liabilities.forEach(liability => {
          const interestRate = 1 + Number(liability.interestRate) / 100;
          netWorth -= Number(liability.amount) * Math.pow(interestRate, year);
        });
  
        netWorth += (yearlyIncome - yearlyExpense) * year;
  
        projections.push({ year, netWorth });
      }
  
      setProjections(projections);
    };
  
    const renderCategoryInputs = (category, fields) => (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Amount</TableCell>
              {fields.includes('growthRate') && <TableCell>Growth Rate (%)</TableCell>}
              {fields.includes('interestRate') && <TableCell>Interest Rate (%)</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {calculatorData[category].map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={item.label}
                    onChange={(e) => handleInputChange(category, index, 'label', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleInputChange(category, index, 'amount', e.target.value)}
                  />
                </TableCell>
                {fields.includes('growthRate') && (
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.growthRate}
                      onChange={(e) => handleInputChange(category, index, 'growthRate', e.target.value)}
                    />
                  </TableCell>
                )}
                {fields.includes('interestRate') && (
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.interestRate}
                      onChange={(e) => handleInputChange(category, index, 'interestRate', e.target.value)}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={() => addItem(category)}>Add {category}</Button>
      </TableContainer>
    );
  
    const renderProjectionChart = () => {
      const data = {
        labels: projections.map(p => p.year),
        datasets: [
          {
            label: 'Net Worth',
            data: projections.map(p => p.netWorth),
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      };
  
      const options = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
  
      return <Line data={data} options={options} />;
    };
  
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Sophisticated Projection Calculator
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Cashflow Income</Typography>
            {renderCategoryInputs('cashflowIncome', ['label', 'amount'])}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Cashflow Expense</Typography>
            {renderCategoryInputs('cashflowExpense', ['label', 'amount'])}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Assets</Typography>
            {renderCategoryInputs('assets', ['label', 'amount', 'growthRate'])}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Liabilities</Typography>
            {renderCategoryInputs('liabilities', ['label', 'amount', 'interestRate'])}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Net Worth Projection (30 Years)</Typography>
            {renderProjectionChart()}
          </Grid>
        </Grid>
      </Container>
    );
  };
  
  export default Calculator;