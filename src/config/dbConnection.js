import mongoose from "mongoose";
import { options } from "./confing.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(options.mongo.url);
        console.log('Conectado a la base de datos.');
    } catch (error) {
        console.log(`Error al tratar de conectar a la BD el error: ${error}`);
    }
}