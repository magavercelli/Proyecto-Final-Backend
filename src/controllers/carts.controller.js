import { cartService, productService, ticketService } from '../repository/index.repository.js';
import { CustomError } from '../services/customError.service.js';
import ticketErrorOptions from '../services/ticketError.js';
import { emailSenderPurchase } from '../utils.js';
import { ERRORS } from '../enum/error.js';
import { generateSendEmailError } from '../services/emailsenderError.js';


class CartsController {
    static getCarts= async (req, res)=>  {
        try {
            const carts = await cartService.getCarts();
            res.json({ status: 'success', carts });
        } catch (error) {
            console.error('Error getting all carts:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    };

    static getCartById = async (req, res)=> {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                res.status(404).json({ status: 'error', message: 'Cart not found' });
            } else {
                res.json({ status: 'success', cart });
            }
        } catch (error) {
            console.error('Error getting cart by ID:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    static addNewCart = async (req,res)=> {
        try {
            const cart = await cartService.addNewCart();
            res.send({
            status: 'success',
            msg: cart
    })
        } catch (error) {
            onsole.error('Error adding new cart:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    static addProductToCart = async (req,res) =>{
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.params.quantity


            const cart = await productService.getProductById(cid, pid, quantity);

            if(product === undefined || product.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    msg: "Product doesn't exist"
                });
            }

            if (product[0].owner === req.user.email){
                return res.status(400).send({
                    status: 'error',
                    msg: 'it is not possible to add a product'
                });
            }

            const addproduct = await cartService.addProductToCart(cid,pid, quantity);

            const carts = await cartService.getCartById(cid);

            if(addproduct){
                res.status(200).send({
                    status: 'success',
                    msg: 'product successfully added',
                    carts
                })
            }
       
        } catch (error) {
            console.error('Error adding product to cart:', error);
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    static deleteProductsInCart =async (req,res)=> {
        const { cid, pid } = req.params;
        try {
            const result = await cartService.deleteProductsInCart(cid, pid);
            res.json(result);
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            res.send({ 
                status: 'error', 
                msg: 'Internal Server Error'
             });
        }
    
    }

    static updateCart = async (req,res)=>  {
        const { cid } = req.params;
        const { updatedProduct } = req.body;

        try {
            const result = await cartService.updateCart(cid, updatedProduct);
            res.json(result);
        } catch (error) {
            console.error('Error updating cart:', error);
            res.send({ 
                status: 'error', 
                msg: 'Internal Server Error' 
            });
        }
    }

    static updateProductQuantity = async (req,res) => {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const result = await cartService.updateProductQuantity(cid, pid, quantity);
            res.json(result);
        } catch (error) {
            console.error('Error updating product quantity in cart:', error);
            res.send({ 
                status: 'error', 
                msg: 'Internal Server Error' 
            });
        }

    }

    static purchase = async (req, res) => {
        try {
            const cartId = req.params.cid;

            const result = await ticketService.createTicket(cartId);

            if (!result) {
                CustomError.createError({
                    name: " The ticket could not be created",
                    cause: ticketErrorOptions.generateCreateTicketError(),
                    message: "The purchase was not successful",
                    errorCode: ERRORS.TICKET_ERROR
                })
            }

            const respond = await emailSenderPurchase(req.session.user.email);

            if (!respond) {
                CustomError.createError({
                    name: "Error sending email",
                    cause: generateSendEmailError(req.session.user.email),
                    message: "The purchase was made successfully, but the email could not be sent",
                    errorCode: ERRORS.EMAIL_SENDER_ERROR
                })
            }

            const carts = await cartService.getCartById(cid);

            for (const product of carts[0].products) {

                for (const m of result.notStock) {

                    if (product.product._id.toString() !== m.id){
                        await cartService.removeProductFromCart(cid, product.product._id);
                    }

                }
            }

            res.send({
                status: "success",
                payload: result
            })

        } catch (error) {
            req.logger.error(error.message);
        }
    }

    static deleteAllProductsInCart = async (req, res)=> {
        const { cid } = req.params;

        try {
            const result = await cartService.deleteAllProductsInCart(cid);
            res.json(result);
        } catch (error) {
            console.error('Error deleting all products from cart:', error);
            res.send({ 
                status: 'error', 
                msg: 'Internal Server Error' 
            });
        }
    }

}

export {CartsController};