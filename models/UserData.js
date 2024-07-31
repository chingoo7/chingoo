const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  incomeCashflow: [{
    label: String,
    amount: Number,
  }],
  expensesCashflow: [{
    label: String,
    amount: Number,
  }],
  assets: [{
    label: String,
    value: Number,
    growthRate: Number,
  }],
  liabilities: [{
    label: String,
    value: Number,
    interestRate: Number,
  }],
});

module.exports = mongoose.model('UserData', UserDataSchema);
