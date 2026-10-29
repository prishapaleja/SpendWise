const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Salary', 'Other'] },
  date: { type: String, required: true },
  type: { type: String, required: true, enum: ['expense', 'income'] }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
