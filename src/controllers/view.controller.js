import ProductManagerDB from "../daos/DBManager/ProductManagerDB.js";
import CartManagerDB from "../daos/DBManager/CartManagerDB.js";
import { userService } from "../repository/index.repository.js";

class ViewController {
    static publicAccess(req, res, next) {
        if (req.session.user) {
            return res.redirect('/');
        }
        next();
    }

    static privateAccess(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        next();
    }
    static async renderRegister(req, res) {
        res.render('register');
    }

    static async renderLogin(req, res) {
        res.render('login');
    }

    static async renderHome(req, res) {
        const productManager = new ProductManagerDB();
        const products = await productManager.getProductHome();
        res.render('home', { products, user: req.session.user });
    }

    static renderResetPassword = (req, res) => {
        try {

            const tokenInfo = req.params.token;

            res.render("resetPassword",{tokenInfo});
        } catch (error) {
            req.logger.error("Error al obtener la vista resetPassword");

            res.status(400).send({
                status: "error",
                msg: "No se logró obtener la vista resetPassword"
            })
        }
    }

    static renderRecoverPassword = (req, res) => {
        try {
            res.render('login');
        } catch (error) {
            req.logger.error("Error al obtener la vista recoverPassword");

            res.status(400).send({
                status: "error",
                msg: "No se pudo obtener la vista recoverPassword"
            })
        }
    }

    static async renderProducts(req, res) {
        try {
            const productManager = new ProductManagerDB();
            const { limit, page, sort, category, availability, query } = req.query;
            const products = await productManager.getProducts(limit, page, sort, category, availability, query);

            console.log( req.session.user)
            res.render('products', { products, user: req.session.user, cartId: req.user.cart._id});
        } catch (error) {
            req.logger.error("Error fetching products:", error.message);
            res.status(500).send('Internal server error');
        }
    }

    static async renderCartDetails(req, res) {
        const cartManager = new CartManagerDB();
        const { cid } = req.params;

        try {
            const carts = await cartManager.getCartById(cid);

            if (carts) {
                req.logger.info(carts);
                res.render('carts', { cart: carts[0] });
            } else {
                res.status(404).json({ error: `Cart with ID ${cid} not found` });
            }
        } catch (error) {
            req.logger.error("Error getting cart details:", error.message);
            res.status(500).send('Internal error server');
        }
    }

    static renderChat(req, res) {
        res.render('chat');
    }

    static renderRealtimeProducts(req, res) {
        res.render('realtimeproducts'  , { user: req.session.user, cartId: req.user.cart._id});
    }
    static uploadDocuments (req, res) {
        res.render('uploadDocuments', { user: req.session.user});
    }
    static getUsers = async (req,res) =>{
        try {
            const users = await userService.getAll();

            res.render ("usersView", {users});
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener usuarios");
        }
    }
}

export {ViewController};