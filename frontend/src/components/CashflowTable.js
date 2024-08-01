import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

function CashflowTable({ data, onUpdate }) {
  const [localData, setLocalData] = useState(data);

  const handleInputChange = (index, field, value) => {
    const newData = [...localData];
    newData[index][field] = value;
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleAddRow = () => {
    const newData = [...localData, { label: '', amount: 0 }];
    setLocalData(newData);
    onUpdate(newData);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Amount (USD)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {localData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  value={item.label}
                  onChange={(e) => handleInputChange(index, 'label', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleInputChange(index, 'amount', parseFloat(e.target.value))}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleAddRow}>Add Row</Button>
    </TableContainer>
  );
}

export default CashflowTable;