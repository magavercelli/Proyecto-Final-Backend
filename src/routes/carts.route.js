import {Router} from 'express';
import { CartsController } from '../controllers/carts.controller.js';

const router = Router();

router.get('/', CartsController.getCarts);

router.get('/:cid', CartsController.getCartById);
router.post ('/', CartsController.addNewCart);

router.post('/:cid/product/:pid', CartsController.addProductToCart);
router.delete('/carts/:cid/products/:pid', CartsController.deleteProductsInCart);

router.put('/carts/:cid', CartsController.updateCart);

router.put('/carts/:cid/products/:pid', CartsController.updateProductQuantity);

router.delete('/carts:cid', CartsController.deleteAllProductsInCart);

export default router;
