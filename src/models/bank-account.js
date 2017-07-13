import mongoose from 'mongoose';

const BankAccountDef = {
    bank: String,
    account: String
};

const bankAccountSchema = mongoose.Schema(BankAccountDef, {timestamps: true});
const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

export {BankAccount, BankAccountDef};