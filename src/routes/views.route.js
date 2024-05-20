import {Router} from 'express';
import { ViewController } from '../controllers/view.controller.js';
import { checkRole, verifyEmailTokenMW } from '../middlewares/auth.js';

const router = Router();

router.get('/register', ViewController.publicAccess, ViewController.renderRegister);

router.get('/login', ViewController.publicAccess, ViewController.renderLogin);

router.get('/', ViewController.publicAccess,ViewController.renderHome);

router.get("/realtimeproducts", checkRole(["admin", "premium"]), ViewController.renderRealtimeProducts);

router.get('/products', ViewController.privateAccess, ViewController.renderProducts);

router.get('/products/:pid', ViewController.privateAccess, ViewController.renderProducts);
 
  router.get('/carts/:cid', ViewController.privateAccess, ViewController.renderCartDetails);

router.get('/resetPassword', verifyEmailTokenMW(), ViewController.renderResetPassword);

router.get("/recoverPassword", ViewController.renderRecoverPassword);



export { router as viewsRoute};