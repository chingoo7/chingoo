const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 80;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Adminguy:Sfsdsjokl7~@calcu.6vdtgqk.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
