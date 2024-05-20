export class CartsRepository{
    constructor(dao) {
        this.dao = dao;
    }

    async getCarts(){
        return await this.dao.getCarts();
    }

    async addNewCart(){
        return await this.dao.addNewCart();
    }

    async getCartById(id){
        return await this.dao.getCartById(id);
    }

    async addProductToCart(cid, pid, quantity){
        return await this.dao.addProductToCart(cid, pid, quantity);
    }

    async updateCart(cid, products){
        return await this.dao.updateCart(cid, products);
    }

    async updateProductQuantity(cid, pid, quantity){
        return await this.dao.updateProductQuantity(cid, pid, quantity);
    }

    async deleteAllProductsInCart(cid){
        return await this.dao.deleteAllProductsInCart(cid);
    }

    async deleteProductsInCart(cid, pid){
        return await this.dao.deleteProductsInCart(cid, pid);
    }
}