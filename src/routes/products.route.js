import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller.js';
import {checkRole} from '../middlewares/auth.js';

const router = Router();

router.get('/', ProductsController.getProducts);

router.get('/:pid', ProductsController.getProductById);

router.post('/', checkRole(['admin', 'premium']), ProductsController.addProduct);

router.put('/:pid', checkRole(['admin', 'premium']), ProductsController.updateProduct);

router.delete('/:pid', checkRole(['admin', 'premium']), ProductsController.deleteProduct);


export default router;

