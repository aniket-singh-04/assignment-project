import { z } from 'zod';

/**
 * Validates request body, query, or params using a Zod schema.
 * @param {z.ZodTypeAny} schema - Zod schema to validate against
 * @param {'body' | 'query' | 'params'} property - Property of req to validate (defaults to 'body')
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      const validData = schema.parse(req[property]);
      // Mutate req to use the validated, potentially type-coerced data
      req[property] = validData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
