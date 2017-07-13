import {Customer} from '../models';
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    Customer.find().then(function (customers) {
        res.json(customers);
    }, function (error) {
        res.status(500).send(error);
    });
});

module.exports = router;