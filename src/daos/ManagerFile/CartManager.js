import fs from 'fs';
import path from 'path';
import __dirname from '../../utils.js';

export default class CartManager {
    constructor(pathFile){
        this.carts = [];
        this.path = path.join(__dirname, `/files/${pathFile}`)
    }

    getCarts = async () => {
        if(fs.existsSync(this.path)){
            const data =  await fs.promises.readFile(this.path, 'utf-8');
            const response = JSON.parse(data);
            return response;
        }else{
            return [];
        }
       
    }

    getCartProductById= async (idCart) => {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id == idCart);
        if (cart) {
            return cart;
        } else {
            return 'Cart not found';
        }

    }

    addNewCart = async () => {
        try { 
            this.carts =await this.getCarts();

            const id = this.carts.length +1;

            let newCart = {
                id,
                products: []
            };

            this.carts.push (newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
            return newCart;

        } catch (error) {
            console.log ('Error');
        }
        
    }

    addProductToCart = async (cartId, productId) => {
        try {
            this.carts = await this.getCarts(); 
            const index = this.carts.findIndex(cart => cart.id == cartId);
            if(index !== -1){
                let cartProducts = this.carts [index].products;
                const indexProduct = cartProducts.findIndex(product => product.productId === productId);
                if(indexProduct !== -1){
                    cartProducts[indexProduct].quantity += 1;
                }else{
                    cartProducts.push ({productId, quantity: 1});
                }

                this.carts[index].products = cartProducts;
            }
                        
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
            return this.carts [index];

        } catch (error) {
            console.log('Error al intentar agregar el producto al carrito:', error);
        }
    }

} 