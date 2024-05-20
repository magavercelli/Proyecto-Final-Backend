import userModel from "../models/user.model.js";
import CartManagerDB from '../DBManager/CartManagerDB.js';

const Cart = new CartManagerDB();

export default class UserManagerDB {
    constructor(){
      this.model = userModel;
  };
  async getAllUsers(){
      try {
          const users = await this.model.find();
          return users;
      } catch (error) {
          throw new Error(error.message)
      }
  }

  async getUser(params){
    return await userModel.findOne(params);
  }
  async getUserById(id){
      try {
          const users = await this.model.findById(id);
          if(!users){
              throw new Error(`No existe la orden con el id: ${id}`)
          }
          return users;
      } catch (error) {
          throw new Error(error.message)
      }
  }
  async saveUser(first_name, last_name, email, age, password,role){
      
    const newCart = await Cart.addNewCart(first_name, last_name, email, age, password,role)
      
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cart: newCart._id
    
      };

      return await userModel.create(newUser);

  }

  async updateUser(id,user){
      try {
          const userUpdate = await this.model.findByIdAndUpdate(id,user, {nre:true});
          return userUpdate;
      } catch (error) {
          throw new Error(error.message)
      }
  }

  async deleteUser(id) {
    await userModel.deleteOne({_id:id});
    return "success";
 }

}



