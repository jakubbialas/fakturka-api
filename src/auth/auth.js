var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jwt-simple');

var configAuth = require('../../config/auth');

router.post("/error", function(req, res) {
    res.status(401).send();
});

var authSuccess = function(req, res) {
    var payload = {
        id: req.user.id
    };
    var token = jwt.encode(payload, configAuth.jwtAuth.secret);
    res.json({
        token: token
    });
};

router.use(passport.initialize());
router.post('/google', passport.authenticate('google-token'), authSuccess);
router.post('/facebook', passport.authenticate('facebook-token'), authSuccess);
router.post("/login", passport.authenticate('local'), authSuccess);

module.exports = router;
