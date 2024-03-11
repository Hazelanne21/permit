// middlewares/authenticateToken.js
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config'); 

// Middleware function to authenticate JWT token in the Authorization header
function authenticateToken(req, res, next) {
  // Extract JWT token from the Authorization header
  const token = req.headers.authorization;

  // Check if the token is not provided
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify the JWT token with the secret key from config.js
  jwt.verify(token, secretKey, (err, user) => {
    // If verification fails, return Forbidden status
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // If verification is successful, attach the user information to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  });
}

// Export the authenticateToken middleware
module.exports = authenticateToken;