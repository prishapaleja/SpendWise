const express = require('express');
const Budget = require('../models/Budget');
const router = express.Router();
const currentMonth = () => new Date().toISOString().slice(0, 7);

router.get('/', async (req, res) => {
  try {
    const budget = await Budget.findOne({ month: currentMonth() });
    res.json(budget || { month: currentMonth(), monthlyLimit: 0, categories: {} });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve budget.' });
  }
});

router.post('/', async (req, res) => {
  const monthlyLimit = Number(req.body.monthlyLimit);
  if (!Number.isFinite(monthlyLimit) || monthlyLimit < 0) {
    return res.status(400).json({ message: 'Monthly budget must be a non-negative number.' });
  }
  const categories = req.body.categories || {};
  for (const [name, value] of Object.entries(categories)) {
    if (!Number.isFinite(Number(value)) || Number(value) < 0) {
      return res.status(400).json({ message: `Invalid budget limit for ${name}.` });
    }
  }
  try {
    const budget = await Budget.findOneAndUpdate(
      { month: currentMonth() },
      { month: currentMonth(), monthlyLimit, categories },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Could not save budget.' });
  }
});

module.exports = router;
