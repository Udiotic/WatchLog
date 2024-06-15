// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const uri = process.env.MONGO_URI || "your-mongodb-uri-here";
const app = express();
const PORT = process.env.PORT || 5000;
console.log('MongoDB URI:', process.env.MONGO_URI);


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user')); // Ensure this line is added

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
