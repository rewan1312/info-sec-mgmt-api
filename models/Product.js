const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
