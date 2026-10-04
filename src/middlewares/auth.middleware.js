import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using JWT.
 */
export const authenticate = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. No token provided.',
    });
  }
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user info to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Invalid or expired token.',
    });
  }
};

/**
 * Middleware to authorize requests based on user roles.
 * @param {...string} roles - Allowed roles (e.g., 'ADMIN', 'OWNER')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Authenticated but insufficient role. Access denied.',
      });
    }

    next();
  };
};
