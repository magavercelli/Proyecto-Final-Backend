import fs from 'fs';
import path from 'path';
import __dirname from '../../utils.js';

export default class ProductManager {
    constructor(pathFile) {
        this.products = [];
        this.path = path.join(__dirname, `/files/${pathFile}`);
    }

    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const data =  await fs.promises.readFile(this.path, 'utf-8');
            const response = JSON.parse(data);
            return response;
        }else{
            return [];
        }
    }

    addProduct = async (product) => {

        const { title, description, price, thumbnail:[foto1,foto2], code, stock, category } = product;

        let newProduct = {
            title,
            description,
            price,
            thumbnail: [foto1, foto2],
            code,
            stock,
            status: true,
            category
        };

        const products = await this.getProducts();

        newProduct.id = products.length +1;

        products.push (newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return products;
    }

    getProductById = async (idProduct) => {
        const products = await this.getProducts();
        const product = products.find(product => product.id == idProduct);
        if (product) {
            return product;
        } else {
            return 'Not found';
        }
    
    }

    updateProduct = async (id, updatedProduc) => {
        const products = await this.getProducts();
        const index = products.findIndex((item)=> item.id == id );

        if(index !== -1){
            products[index] = { ... products[index], ...updatedProduc};

            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return products[index];
        }else {
            return 'Product not found';
        }
    }

    deleteProduct = async (idProduct) => {

        const products = await this.getProducts();
        const index = products.findIndex(product => product.id == idProduct);

        if (index !== -1){
            const deletedProduct = products.splice(index, 1);

            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return deletedProduct[0];
        }else {
            return 'Product not found'
        }
    }
}
