const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');

// Get user data
router.get('/', async (req, res) => {
  try {
    let userData = await UserData.findOne();
    if (!userData) {
      userData = new UserData({
        incomeCashflow: [],
        expensesCashflow: [],
        assets: [],
        liabilities: []
      });
      await userData.save();
    }
    console.log('User data retrieved:', userData);
    res.json(userData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update user data
router.put('/', async (req, res) => {
  try {
    const updatedUserData = await UserData.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedUserData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;