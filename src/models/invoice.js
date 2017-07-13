import mongoose from 'mongoose';
import {InvoicePositionDef} from '.';
import {CustomerDef} from '.';
import {BankAccountDef} from '.';

const invoiceSchema = mongoose.Schema({
    number: String,
    customer: CustomerDef,
    seller: CustomerDef,
    invoiceDate: Date,
    invoicePlace: String,
    paymentDate: Date,
    paymentMethod: String,
    bankAccount: BankAccountDef,
    saleDate: Date,
    notes: String,
    price: Number,
    tax: Number,
    totalPrice: Number,
    totalPriceText: String,
    positions: [InvoicePositionDef],
}, {timestamps: true});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export {Invoice};