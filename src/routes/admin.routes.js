import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { userQuerySchema, createUserSchema } from '../validators/user.schema.js';
import { storeQuerySchema, createStoreSchema } from '../validators/store.schema.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', AdminController.getDashboard);

router.get('/users', validate(userQuerySchema, 'query'), AdminController.listUsers);
router.post('/users', validate(createUserSchema), AdminController.createUser);
router.get('/users/:id', AdminController.getUser);
router.delete('/users/:id', AdminController.deleteUser);

router.get('/stores', validate(storeQuerySchema, 'query'), AdminController.listStores);
router.post('/stores', validate(createStoreSchema), AdminController.createStore);
router.delete('/stores/:id', AdminController.deleteStore);

export default router;
