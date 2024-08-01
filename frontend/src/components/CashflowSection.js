import React from 'react';
import { Grid, Typography } from '@mui/material';
import CashflowTable from './CashflowTable';

function CashflowSection({ incomeCashflow, expensesCashflow, updateUserData }) {
  const handleIncomeUpdate = (newIncome) => {
    updateUserData((prevData) => ({ ...prevData, incomeCashflow: newIncome }));
  };

  const handleExpensesUpdate = (newExpenses) => {
    updateUserData((prevData) => ({ ...prevData, expensesCashflow: newExpenses }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">Income Cashflow</Typography>
        <CashflowTable data={incomeCashflow} onUpdate={handleIncomeUpdate} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5">Expenses Cashflow</Typography>
        <CashflowTable data={expensesCashflow} onUpdate={handleExpensesUpdate} />
      </Grid>
    </Grid>
  );
}

export default CashflowSection;