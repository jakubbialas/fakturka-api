import {Router} from 'express';
import {User} from '../models';
import {Mailer} from '../helpers/mailer-transport';
import * as configAuth from '../../config/auth.json';
import * as util from 'util';
import * as jwt from 'jwt-simple';
import moment from 'moment';

const router = Router();

router.post('/', registerValidate);
router.post('/', registerCheckUser);
router.post('/', registerCreateUser);
router.post('/', sendOkResponse);
router.post('/', registerSendEmail);
router.post('/', terminateRequest);

router.post('/confirm', confirmValidateToken);
router.post('/confirm', confirmFindUser);
router.post('/confirm', confirmUpdateUser);
router.post('/confirm', confirmSendAccessToken);
router.post('/confirm', terminateRequest);

function registerValidate(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            return res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
        }
        next();
    }, function (err) {
        res.status(500).send(err);
    });
}

function registerCheckUser(req, res, next) {
    var email = req.body.email;

    User.findOne({email: email}).then(function (user) {
        if (user) {
            res.status(400).send('User already exists');
        } else {
            next();
        }
    }, function (err) {
        res.status(500).send(err);
    });
}

function registerCreateUser(req, res, next) {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        passwordLoginEnabled: false
    });

    user.save(function (err, user) {
        if (err) {
            return res.status(500).send();
        } else {
            req.user = user;
            next();
        }
    });
}

function registerSendEmail(req, res, next) {
    var confirmUrl = req.body.confirmUrl;
    var email = req.body.email;

    var payload = {
        type: 'email-confirmation',
        email: email,
        expiresAt: moment().add(1, 'day').format()
    };
    var token = jwt.encode(payload, configAuth.jwtAuth.secret);
    var link = req.headers.origin + confirmUrl + '?token=' + token;

    Mailer.sendMail({
        from: Mailer.sender,
        to: email,
        subject: 'Fakturka - confirm registration',
        text: 'To confirm registration please follow link ' + link,
        html: '<p>To confirm registration please click <a href="' + link + '">here</a>.</p>'
    });

    next();
}

function confirmValidateToken(req, res, next) {
    var token = req.body.token;
    var payload = jwt.decode(token, configAuth.jwtAuth.secret);

    if (payload.type !== 'email-confirmation') {
        return res.status(400).send('Invalid token');
    }
    if (moment(payload.expiresAt).isBefore(moment())) {
        return res.status(400).send('Token expired');
    }
    req.payload = payload;

    next();
}

function confirmFindUser(req, res, next) {
    var email = req.payload.email;

    User.findOne({email: email}).then(function (user) {
        if (!user) {
            res.status(404).send('User not found');
        } else {
            req.user = user;
            next();
        }
    }, function (err) {
        res.status(500).send(err);
    });
}

function confirmUpdateUser(req, res, next) {
    const user = req.user;

    user.set({ passwordLoginEnabled: true });
    user.save(function (err) {
        if (err) {
            return res.status(500).send();
        }
        next();
    });
}

function confirmSendAccessToken(req, res, next) {
    const user = req.user;

    const payload = {
        type: 'auth-token',
        id: user.id,
        expiresAt: moment().add(16, 'day').format() // valid for 16 days...
    };

    var token = jwt.encode(payload, configAuth.jwtAuth.secret);

    res.json({
        token: token
    });

    next();
}

function sendOkResponse(req, res, next) {
    res.status(204).send();
    next();
}

function terminateRequest(req, res, next) {
    // won't call next will terminate request
}

export {router as Register};
