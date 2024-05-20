import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        require: true,
        enum: ['Bedidas sin alcohol', 'Bedidas con alcohol', 'Bedidas Gaseosas', 'Almacen']
    },
    owner: {
        type: String,
        default: 'admin'
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;