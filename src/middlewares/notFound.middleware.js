// src/middlewares/notFound.middleware.js

/**
 * Handles requests to unknown routes.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
