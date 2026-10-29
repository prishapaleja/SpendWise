const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Return newest transactions first.
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve transactions.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.name === 'ValidationError' ? error.message : 'Could not add transaction.' });
  }
});

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' });
  try {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.name === 'ValidationError' ? error.message : 'Could not update transaction.' });
  }
});

router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid transaction ID.' });
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Could not delete transaction.' });
  }
});

module.exports = router;
