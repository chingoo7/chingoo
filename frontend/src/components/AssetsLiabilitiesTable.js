// src/components/AssetsLiabilitiesTable.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

function AssetsLiabilitiesTable({ data, onUpdate, isAsset }) {
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleInputChange = (index, field, value) => {
    const newData = [...localData];
    newData[index][field] = value;
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleAddRow = () => {
    const newData = [...localData, { label: '', value: 0, [isAsset ? 'growthRate' : 'interestRate']: 0 }];
    setLocalData(newData);
    onUpdate(newData);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Label</TableCell>
            <TableCell>Value (USD)</TableCell>
            <TableCell>{isAsset ? 'Growth Rate (%)' : 'Interest Rate (%)'}</TableCell>
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
                  value={item.value}
                  onChange={(e) => handleInputChange(index, 'value', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={item[isAsset ? 'growthRate' : 'interestRate']}
                  onChange={(e) => handleInputChange(index, isAsset ? 'growthRate' : 'interestRate', parseFloat(e.target.value))}
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

export default AssetsLiabilitiesTable;