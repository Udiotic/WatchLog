const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure the correct path to the User model

module.exports = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id); // Ensure the user exists in the database
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};
