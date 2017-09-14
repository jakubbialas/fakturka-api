import {Router} from 'express';
import {Register} from './register';
import {ResetPassword} from './reset-password';
import * as configAuth from '../../config/auth.json';
import moment from 'moment';
import * as jwt from 'jwt-simple';
import passport from 'passport';

var authSuccess = function(req, res) {
    var payload = {
        type: 'auth-token',
        id: req.user.id,
        expiresAt: moment().add(16, 'day').format() // valid for 16 days...
    };
    var token = jwt.encode(payload, configAuth.jwtAuth.secret);
    res.json({
        token: token
    });
};

var onAuth = function(req, res, next) {
    return function(err, user, info) {
        if (err) { return res.status(500).send(err); }
        if (!user) { return res.status(401).send(info); }
        req.user = user;
        return authSuccess(req, res);
    };
};

const router = Router();
router.use(passport.initialize());
router.post('/google', function(req, res, next) {
    passport.authenticate('google-token', onAuth(req, res, next))(req, res, next);
});
router.post('/facebook', function(req, res, next) {
    passport.authenticate('facebook-token', onAuth(req, res, next))(req, res, next);
});
router.post('/linkedin', function(req, res, next) {
    passport.authenticate('molch', onAuth(req, res, next))(req, res, next);
});
router.post('/login', function(req, res, next) {
    passport.authenticate('local', onAuth(req, res, next))(req, res, next);
});

router.use('/register', Register);
router.use('/reset-password', ResetPassword);

module.exports = router;
