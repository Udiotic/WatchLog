const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to send verification email
const sendVerificationEmail = (email, token) => {
    const url = `${process.env.BASE_URL}/verify-email?token=${token}`;
    const data = {
        from: 'Watchlog <no-reply@sandbox53dfd7e043ac4ee19b1a291ad4d48ce9.mailgun.org>',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please verify your email by clicking on the link below:</p>
               <a href="${url}">Verify Email</a>`
    };

    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log('Mailgun Error:', error);
        } else {
            console.log('Mailgun Response:', body);
        }
    });
};

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        user = new User({ username, email, password, isVerified: false });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id, email: user.email } };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // Send verification email
        sendVerificationEmail(user.email, token);

        res.status(200).json({ message: 'Registration successful, please check your email for verification link' });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Verify Email
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error('Verification Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        const user = await User.findOne({ 
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }] 
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email to login' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
