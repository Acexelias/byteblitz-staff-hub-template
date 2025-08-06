/**
 * Simple role-based access control middleware.
 *
 * Pass one or more allowed roles (e.g. ['admin']) and the middleware will
 * ensure that the authenticated user has one of the roles.  If not, a
 * 403 Forbidden response is returned.
 *
 * Usage:
 *   const authorize = require('./middleware/role');
 *   app.get('/admin-only', authenticate, authorize('admin'), handler);
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
  };
}

module.exports = authorize;