var express = require('express');
var users = require('./users');
var products = require('./products');
var customers = require('./customers');
var invoices = require('./invoices');
var bankAccounts = require('./bank-accounts');
var router = express.Router();

router.use('/users', users);
router.use('/products', products);
router.use('/customers', customers);
router.use('/invoices', invoices);
router.use('/bank-accounts', bankAccounts);

router.get('/', function (req, res) {
    res.json({'version': '1.0.0'});
});


module.exports = router;