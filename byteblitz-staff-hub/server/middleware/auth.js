const jwt = require('jsonwebtoken');

/**
 * Authenticate requests by verifying the JWT in the `Authorization` header.
 *
 * Clients must send a header like `Authorization: Bearer <token>`.  If the
 * token is valid, the decoded payload (containing `id` and `role`) is
 * attached to `req.user`.  Otherwise, a 401 response is returned.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;