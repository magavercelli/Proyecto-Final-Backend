import ticketModel from '../models/tickets.model.js';
import CartManagerDB from './CartManagerDB.js';
import ProductManagerDB from './ProductManagerDB.js';
import UserManagerDB from './UserManagerDB.js';

const product = new ProductManagerDB();
const cart = new CartManagerDB();
const user = new UserManagerDB();

export class TicketManagerDB {
    async getTicket(email) {
        try {
            const ticket = await ticketModel.findOne({purchaser: email}).lean();

            if (!ticket) {
                return "Ticket not found";
            }

            ticket.purchase_datetime = ticket.purchase_datetime.split(' ');

            return ticket;

        } catch (error) {
            console.error('Error getting ticket');
        }
    }

    async updateProductsStock(products) {
        for (const item of products) {

            const product_id = await product.getProductById(item.product._id);

            let stockUpdate = product_id[0].stock - item.quantity;

            await product.updateProduct(product_id[0]._id, {stock: stockUpdate});
        }
    }

    async calculateAmount(arrayProducts) {
        let totalAmount = 0;

        for (const item of arrayProducts) {
            let quantity = item.quantity;
            console.log(`Checking product: ${item.product._id}`);

            let isStock = await product.isInStock(quantity, item.product._id);
            console.log(`Is in stock: ${isStock}`);

            if (isStock) {
                const products = await product.getProductById(item.product._id);
                console.log(`Product details: ${JSON.stringify(products)}`);
                totalAmount += products[0].price * quantity;
            }
        }

        console.log(`Total amount: ${totalAmount}`);
        return parseFloat(totalAmount);
    }

    async purchesedProducts(cid, arrayProducts) {
        try {
            let productsNotStock = [];
            let productsInStock = [];

            for (const item of arrayProducts) {
                let amountProducts = item.quantity;

                let isStock = await product.isInStock(amountProducts, item.product.id);

                if (isStock) {
                    productsInStock.push(item);

                    await cart.deleteProductsInCart(cid, item.product.id);

                } else {
                    productsNotStock.push({
                        id: item.product.id
                    });
                }
            }

            return {
                productsNotStock,
                productsInStock
            };

        } catch (error) {
            console.log(error.message);
        }
    }

    async createTicket(cid) {
        try {

            const User = await user.getUser({cart: cid});
            const Cart = await cart.getCartById(cid);

            if (!User) {
                return "User not found";
            }

            if (!Cart) {
                return `The cart with the id was not found: ${cid}`;
            }
            console.log(Cart)
            const code = crypto.randomUUID();
            let created_at = "";
            let amount = 0;
            const purchaser = user.email;

            const date = new Date();

            const [day, month, year] = [
                date.getDate(),
                date.getMonth(),
                date.getFullYear(),
            ];

            created_at = `dia: ${day}, mes: ${month + 1}, año: ${year}`;

            amount = await this.calculateAmount(cart[0].products);


            const {productsNotStock, productsInStock} = await this.purchesedProducts(cid, Cart[0].products);

            await this.updateProductsStock(productsInStock);

            const newTicket = {
                code: code,
                purchase_datetime: created_at,
                amount: amount,
                purchaser: purchaser
            }

            const ticketCreated = await ticketModel.create(newTicket);

            return {
                ticket: ticketCreated,
                notStock: productsNotStock
            };

        } catch (error) {
            console.log(error.message);
        }
    }
}