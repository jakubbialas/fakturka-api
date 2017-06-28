var User = require('../models/User');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    User.find().then(function (users) {
        res.json(users);
    }, function (error) {
        res.status(400).send(error);
    });
});

module.exports = router;