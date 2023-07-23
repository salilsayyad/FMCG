// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  //console.log(req.headers);
  console.log(authHeader);
  const token =authHeader.replace('Bearer ', '');

  if (!token) {
    return res.sendStatus(401);
  }
 console.log(config.jwtSecret);
  jwt.verify(authHeader, config.jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403,err.message);
    }
    console.log("successs")
    req.user = user;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return res.sendStatus(403);
    }
  };
}

module.exports = {
  authenticateToken,
  authorizeRole,
};
