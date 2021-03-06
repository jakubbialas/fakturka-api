import {User} from '../models';
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    User.find().then(function (users) {
        res.json(users);
    }, function (error) {
        res.status(500).send(error);
    });
});

module.exports = router;