import { productService, userService } from "../repository/index.repository.js";
import userModel from "../daos/models/user.model.js";
import { sendEmailProductRemoved } from "../config/gmail";
import { ERRORS } from "../enum/error.js";
import { CustomError } from "../services/customError.service.js";
import productErrorOptions from "../services/productError.js";



class  ProductsController {

    static getProducts = async (req,res)=> {
        try {
            const { limit = 10, page = 1, sort = '', query = '' } = req.query;
            const products = await productService.getProducts( limit, page, sort, query );

            if(!products){
                CustomError.createError({
                    name: 'Could not get products',
                    cause: productErrorOptions.generateGetProductsError(),
                    msg: 'Erros searching for products',
                    errorCode: ERRORS.PRODUCT_ERROR
                });
            }
            res.send({products});
    
        } catch (error) {
            console.log('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    static getProductById = async (req,res)=> {
        try {
            const productId = req.params.pid;
            const product = await productService.getProductById(productId);

            if(typeof product === 'string'){
                CustomError.createError({
                    name: 'Could not get product',
                    cause: productErrorOptions.generateGetProductByIdError(productId),
                    msg: product,
                    errorCode: ERRORS.PRODUCT_ERROR
                })
            }
            res.send({ product });
        } catch (error) {
            console.log('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    static addProduct = async (req, res)=> {
        try {
            const {title, description, price,  thumbnail: [foto1, foto2], code, stock, status, category} = req.body;
            if(!title || !description || !price || !thumbnail || !code || !stock || !status || !stock){
            return res.status(400).send({error: 'Datos incompletos'});
    }

        let newProduct = {
            id,
            title, 
            description,
            price,
            thumbnail: [foto1, foto2],
            code,
            stock,
            status: true,
            category
    }

        const result = await productService.addProduct(newProduct);
        res.send({result});
        } catch (error) {
            console.log('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async updateProduct(req, res) {
        try {
            const pid = req.params.pid;

            let updateProduct
            if (req.user.role === "admin"){

                updateProduct = await productService.updateProduct(pid, req.body);

                if (typeof updateProduct === "string") {
                    CustomError.createError({
                        name: "Could not update the product",
                        cause: productErrorOptions.generateUpdateProductError(pid),
                        message: updateProduct,
                        errorCode: ERRORS.PRODUCT_ERROR
                    })
                }
                res.send({
                    status: "success",
                    message: `The product with the id was successfully modified: ${pid}`
                })
            }

            const product = await productService.getProductById(pid);
            if (product === undefined || product.length === 0) {
               
                return res.status(400).send({
                    status: 'error',
                    msg: "Product does not exist",
                });
            }

            if (product[0].owner === req.user.email){

                updateProduct = await productService.updateProduct(pid, req.body);

                if (typeof updateProduct === "string") {
                    CustomError.createError({
                        name: "Could not update the product",
                        cause: productErrorOptions.generateUpdateProductError(pid),
                        message: updateProduct,
                        errorCode: ERRORS.PRODUCT_ERROR
                    })
                }
                res.send({
                    status: "success",
                    message: `The product with the id was successfully modified: ${pid}`
                })

            }else {
                res.status(400).send({
                    status: 'error',
                    msg: "Access denied to delete",
                });
            }


        } catch (error) {
            req.logger.error("Could not update the product");
        }
    }

    static async deleteProduct(req,res) {

        let response = {};

        try {
            const pid = req.params.pid;
            const product = await productService.getProductById(pid);
            console.log(req.user.role)
            console.log(product)
            const ownerUser = await userModel.findOne({email: product[0].owner})

            let deleteProduct;

            if (req.user.role === "admin") {
                deleteProduct = await productService.deleteProduct(pid);
                console.log(deleteProduct)
                if (deleteProduct === "success") {
                    response = {
                        status: "success",
                        msg: `Deleted product with id: ${pid}`
                    };
                    if (ownerUser){
                        if (ownerUser.role === "premium") {
                            await sendEmailProductRemoved(req.user.email, product);
                        }
                    }

                }

            } else {

                if (!product || product.length === 0) {
                    response = {
                        status: 'error',
                        msg: "Product does not exist",
                    };
                } else if (product[0].owner === req.user.email) {
                    deleteProduct = await productService.deleteProduct(pid);
                    if (deleteProduct === "success") {
                        response = {
                            status: "success",
                            msg: `Deleted product with id: ${pid}`
                        };

                    }
                } else {
                    response = {
                        status: 'error',
                        msg: "Access denied to delete",
                    };
                }
            }

            if (response.msg) {
                res.status(400).send(response);
            }

        } catch (error) {

            console.log(error)
            req.logger.error("Unable to delete product");
            if (error.name === "DeleteProductError") {
                response = {
                    status: 'error',
                    msg: error.message,
                    error: error
                };
            } else {
                response = {
                    status: 'error',
                    msg: 'Internal server error'
                };
            }
            res.status(500).send(response);
        }
    }
}

export { ProductsController };