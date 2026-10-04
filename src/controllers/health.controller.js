// src/controllers/health.controller.js

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export const getHealth = (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  });
};
