const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
            return res.status(400).json({ message: '❌ All fields are required' });
        }

        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '❌ Username already exists' });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const newUser = new User({ name, username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: '✅ User registered successfully' });
    } catch (error) {
        console.error('❌ Error registering user:', error);
        res.status(500).json({ message: '❌ Error registering user', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

       
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '❌ Invalid username or password' });
        }

       
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Invalid username or password' });
        }

        
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '10m' });

        res.json({ message: '✅ Login successful', token });
    } catch (error) {
        console.error('❌ Error logging in:', error);
        res.status(500).json({ message: '❌ Error logging in', error: error.message });
    }
});


router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password'); 
        res.json(users);
    } catch (error) {
        console.error('❌ Failed to fetch users:', error);
        res.status(500).json({ message: '❌ Failed to fetch users', error: error.message });
    }
});


router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, username } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, username }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: '❌ User not found' });
        }

        res.json({ message: '✅ User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('❌ Failed to update user:', error);
        res.status(500).json({ message: '❌ Failed to update user', error: error.message });
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: '❌ User not found' });
        }

        res.json({ message: '✅ User deleted successfully' });
    } catch (error) {
        console.error('❌ Failed to delete user:', error);
        res.status(500).json({ message: '❌ Failed to delete user', error: error.message });
    }
});

module.exports = router;
