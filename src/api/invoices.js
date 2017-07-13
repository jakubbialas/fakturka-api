import {Invoice} from '../models';
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    Invoice.find().then(function (invoices) {
        res.json(invoices);
    }, function (error) {
        res.status(500).send(error);
    });
});

module.exports = router;