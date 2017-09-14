import {Router} from 'express';
import {User} from '../models';
import {Mailer} from '../helpers/mailer-transport';
import * as configAuth from '../../config/auth.json';
import * as util from 'util';
import * as jwt from 'jwt-simple';
import moment from 'moment';

const router = Router();

router.post('/', resetPasswordValidate);
router.post('/', resetPasswordFindUser);
router.post('/', sendOkResponse);
router.post('/', resetPasswordSendEmail);
router.post('/', terminateRequest);

router.post('/validate-token', changePasswordValidateToken);
router.post('/validate-token', changePasswordFindUser);
router.post('/validate-token', sendOkResponse);
router.post('/validate-token', terminateRequest);

router.post('/change-password', changePasswordValidateToken);
router.post('/change-password', changePasswordFindUser);
router.post("/change-password", changePasswordSetPass);
router.post("/change-password", sendOkResponse);
router.post('/change-password', terminateRequest);

function resetPasswordValidate (req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
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

function resetPasswordFindUser (req, res, next) {
    var email = req.body.email;

    User.findOne({email: email}).then(function (user) {
        if (!user) {
            return res.status(400).send("User don't exists");
        }

        req.user = user;
        next();
    }, function (err) {
        res.status(500).send(err);
    });
}

function resetPasswordSendEmail (req, res, next) {
    var email = req.body.email;
    var changeUrl = req.body.changeUrl;
    var payload = {
        type: 'reset-password',
        email: email,
        expiresAt: moment().add(1, 'day').format()
    };
    var token = jwt.encode(payload, configAuth.jwtAuth.secret);
    var link = req.headers.origin + changeUrl + '?token=' + token;

    Mailer.sendMail({
        from: Mailer.sender,
        to: email,
        subject: 'Fakturka - reset password',
        text: 'To reset password please follow link ' + link,
        html: '<p>To reset password please click <a href="' + link + '">here</a>.</p>' // html body
    });

    next();
}

function changePasswordValidateToken(req, res, next) {
    var token = req.body.token;
    var payload = jwt.decode(token, configAuth.jwtAuth.secret);

    if (payload.type !== 'reset-password') {
        return res.status(400).send('Invalid token');
    }
    if (moment(payload.expiresAt).isBefore(moment())) {
        return res.status(400).send('Token expired');
    }

    req.payload = payload;
    next();
}

function changePasswordFindUser (req, res, next) {
    var email = req.payload.email;

    User.findOne({email: email}).then(function (user) {
        if (!user) {
            return res.status(400).send("User don't exists");
        }

        req.user = user;
        next();
    }, function (err) {
        res.status(500).send(err);
    });
}

function changePasswordSetPass(req, res, next) {
    var user = req.user;
    var password = req.body.password;

    user.set({ password: password, passwordLoginEnabled: true });
    user.save(function (err) {
        if (err) {
            return res.status(500).send();
        }
        next();
    });
}

function sendOkResponse(req, res, next) {
    res.status(204).send();
    next();
}

function terminateRequest(req, res, next) {
    // won't call next will terminate request
}

export {router as ResetPassword};
