import mongoose from 'mongoose';

const CustomerDef = {
    name: String,
    nip: String,
    street: String,
    zip: String,
    city: String
};

const customerSchema = mongoose.Schema(CustomerDef, {timestamps: true});
const Customer = mongoose.model('Customer', customerSchema);

export {Customer, CustomerDef};