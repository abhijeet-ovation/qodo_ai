const express = require('express');
const itemRoutes = require('./routes/items');

const app = express();

app.use(express.json());

app.use('/api/items', itemRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app; 