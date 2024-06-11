const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const uri = "mongodb+srv://udit:R83eKut8FSPGIZsc@watchlog.tqdj78a.mongodb.net/?retryWrites=true&w=majority&appName=Watchlog";
const app = express();
const PORT = process.env.PORT || 5000;
console.log('MongoDB URI:', process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
