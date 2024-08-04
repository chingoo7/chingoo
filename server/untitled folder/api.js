const express = require('express');
const router = express.Router();
const CalculatorData = require('../models/CalculatorData');

router.get('/data', async (req, res) => {
  try {
    const data = await CalculatorData.findOne();
    if (!data) {
      const newData = new CalculatorData({
        cashflowIncome: [],
        cashflowExpense: [],
        assets: [],
        liabilities: [],
      });
      await newData.save();
      res.json(newData);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/data', async (req, res) => {
  try {
    const data = await CalculatorData.findOne();
    if (!data) {
      const newData = new CalculatorData(req.body);
      await newData.save();
      res.json(newData);
    } else {
      Object.assign(data, req.body);
      await data.save();
      res.json(data);
    }
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
