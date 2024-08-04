const mongoose = require('mongoose');

const calculatorDataSchema = new mongoose.Schema({
  cashflowIncome: [{ label: String, value: Number }],
  cashflowExpense: [{ label: String, value: Number }],
  assets: [{ label: String, value: Number, growthRate: Number }],
  liabilities: [{ label: String, value: Number, interestRate: Number }],
});

module.exports = mongoose.model('CalculatorData', calculatorDataSchema);
