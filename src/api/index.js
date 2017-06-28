var express = require('express');
var users = require('./users');
var products = require('./products');
var router = express.Router();

router.use('/users', users);
router.use('/products', products);

router.get('/', function (req, res) {
    res.json({'version': '1.0.0'});
});


module.exports = router;