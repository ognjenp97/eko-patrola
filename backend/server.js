const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const reportRoutes = require('./routes/reports');

const app = express();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Eko Patrola API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});
