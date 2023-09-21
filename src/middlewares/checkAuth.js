const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        req.user = {};
        req.user = { id: decodedToken.id, role: decodedToken.role };

        next();
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).json({ error: 'An error occurred while processing authentication' });
    }
};

module.exports = checkAuth
