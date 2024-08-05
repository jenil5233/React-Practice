const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jenilashodiaSeCRETkeysdasdasda..'; // Replace with your actual JWT secret key

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user info to request object
        next(); // Pass control to the next middleware function
    });
};

module.exports = {
    authenticateJWT,
    JWT_SECRET,
};