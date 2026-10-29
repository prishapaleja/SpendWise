require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ message: 'API route not found.' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Add it to server/.env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.');
    app.listen(PORT, () => console.log(`SpendWise API running at http://localhost:${PORT}`));
  })
  .catch(error => {
    console.error('Could not connect to MongoDB:', error.message);
    process.exit(1);
  });
