const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: 'Invalid token - user not found' });

    req.user = user; // attach user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized or invalid token', error: err.message });
  }
};

// Role-based access middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: only ${roles.join(', ')} allowed`
      });
    }
    next();
  };
};
