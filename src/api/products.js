var Product = require('../models/Product');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    Product.find().then(function (users) {
        res.json(users);
    }, function (error) {
        res.status(400).send(error);
    });
});

module.exports = router;