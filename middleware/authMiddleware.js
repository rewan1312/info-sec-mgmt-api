const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization'); 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '❌ Access Denied! No valid token provided.' });
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = verified; 
        next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '❌ Token expired. Please login again.' });
        }
        res.status(400).json({ message: '❌ Invalid Token' });
    }
};

module.exports = authMiddleware;
