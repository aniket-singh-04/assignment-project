import { Router } from 'express';
import { OwnerController } from '../controllers/owner.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate, authorize('OWNER'));

router.get('/dashboard', OwnerController.getDashboard);
router.get('/ratings', OwnerController.getRatings);

export default router;
