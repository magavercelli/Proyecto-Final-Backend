import mongoose from "mongoose";

const usersCollection = 'Users';

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    age: {
        type: Number,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    },
    documents: [
        {
            name: {
                type: String,
            },
            reference: {
                type: String,
            },
        },
    ],
    last_connection: {
        type: Date,
    }
})

const userModel = mongoose.model(usersCollection, schema);

export default userModel;