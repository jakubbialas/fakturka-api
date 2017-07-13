import mongoose from 'mongoose';

const ProductDef = {
    name: String,
    pkwiu: String,
    unit: String,
    unitPrice: Number,
    vatRate: Number
};

const productSchema = mongoose.Schema(ProductDef, {timestamps: true});
const Product = mongoose.model('Product', productSchema);

export { Product, ProductDef };