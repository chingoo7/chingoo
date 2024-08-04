const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

// CORS configuration
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Enable sending cookies
};

app.use(cors(corsOptions)); // Apply CORS middleware with the configured options

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('MongoDB URI:', process.env.MONGODB_URI);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.error('MongoDB URI:', process.env.MONGODB_URI);
});

// Routes
const userDataRoutes = require('./routes/userDataRoutes');
app.use('/api/userdata', userDataRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Catch-all route to serve the index.html file for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});