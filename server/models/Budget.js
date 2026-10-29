const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true },
  monthlyLimit: { type: Number, min: 0, default: 0 },
  categories: { type: Map, of: Number, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
