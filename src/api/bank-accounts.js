import {BankAccount} from '../models';
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    BankAccount.find().then(function (bankAccounts) {
        res.json(bankAccounts);
    }, function (error) {
        res.status(500).send(error);
    });
});

module.exports = router;