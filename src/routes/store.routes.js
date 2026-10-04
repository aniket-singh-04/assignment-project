import { Router } from 'express';
import { StoreController } from '../controllers/store.controller.js';
import { RatingController } from '../controllers/rating.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { storeQuerySchema } from '../validators/store.schema.js';
import { submitRatingSchema, updateRatingSchema } from '../validators/rating.schema.js';

const router = Router();

// Stores endpoints
// Protected by 'authenticate' and 'authorize("USER")' according to spec, wait, spec says "USER".
// Let's allow users to see stores. Usually everyone or USER.
router.get('/', authenticate, authorize('USER'), validate(storeQuerySchema, 'query'), StoreController.listStores);

// Ratings endpoints
router.post('/:storeId/ratings', authenticate, authorize('USER'), validate(submitRatingSchema), RatingController.submitRating);
router.patch('/:storeId/ratings', authenticate, authorize('USER'), validate(updateRatingSchema), RatingController.modifyRating);

export default router;
