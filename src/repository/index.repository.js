import {UsersRepository} from './users.repository.js';
import UserManagerDB from '../daos/DBManager/UserManagerDB.js';
import ProductManagerDB from '../daos/DBManager/ProductManagerDB.js';
import CartManagerDB from '../daos/DBManager/CartManagerDB.js';
import {ProductsRepository} from '../repository/products.repository.js';
import {CartsRepository} from '../repository/carts.repository.js';
import TicketManagerDB from '../daos/DBManager/TicketManagerDB.js';
import {TicketsRepository} from '../repository/tickets.repository.js';

const user = new UserManagerDB();

const product = new ProductManagerDB();
const cart = new CartManagerDB();
const ticket = new TicketManagerDB();


export const userService = new UsersRepository(user);
export const productService = new ProductsRepository(product);
export const cartService = new CartsRepository(cart);
export const ticketService = new TicketsRepository(ticket);