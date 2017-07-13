import mongoose from 'mongoose';

const InvoicePositionDef = {
    name: String,
    pkwiu: String,
    unit: String,
    unitPrice: Number,
    vatRate: Number,
    quantity: Number,
    price: Number,
    tax: Number,
    priceTotal: Number
};

const invoicePositionSchema = mongoose.Schema(InvoicePositionDef, {timestamps: true});
const InvoicePosition = mongoose.model('InvoicePosition', invoicePositionSchema);

export {InvoicePosition, InvoicePositionDef};