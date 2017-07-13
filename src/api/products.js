import {Product} from '../models';
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    Product.find().then(function (products) {
        res.json(products);
    }, function (error) {
        res.status(500).send(error);
    });
});

router.get('/:productId', function (req, res) {
    var productId = req.params.productId;

    Product.find({id: productId}).then(function (product) {
        if (product) {
            res.json(product);
        } else {
            res.status(404).send();
        }
    }, function (error) {
        res.status(500).send(error);
    });
});


router.post('/', function (req, res) {
    var product = new Product(req.body);

    product.save(function (err, product) {
        if (err) {
            res.status(500).send();
            console.error(err);
        } else {
            res.status(201).location(req.serverUrl + '/api/products/' + product._id).send();
        }

    });
});

module.exports = router;