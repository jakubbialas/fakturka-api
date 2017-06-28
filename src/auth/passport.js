"use strict";

var configAuth = require('../../config/auth');

var GoogleTokenStrategy = require('passport-google-token').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var LocalStrategy = require('passport-local').Strategy;
var Jwt = require("passport-jwt");
var JwtStrategy = Jwt.Strategy;
var ExtractJwt = Jwt.ExtractJwt;
var User = require('../models/User');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            done(null, user);
        }, function (err) {
            done(err);
        });
    });

    passport.use(new JwtStrategy({
        secretOrKey: configAuth.jwtAuth.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        session: false
    }, function (payload, done) {
        User.findById(payload.id).then(function (user) {
            if (user) {
                return done(null, user);
            } else {
                return done(new Error("User not found"));
            }
        }, function (err) {
            return done(err);
        });
    }));

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, function (email, password, done) {
        User.findOne({where: {email: email}}).then(function (user) {
            if (!user || user.password !== password) {
                return done('Invalid email or password');
            }
            return done(null, user);
        }, function (err) {
            return done(err);
        });
    }));
    
    passport.use(new GoogleTokenStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
    }, function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({
            'google.id': profile.id 
        }, function(err, user) {
            if (err || user) {
                return done(err, user);
            }
                
            User.findOne({
                'email': profile.emails[0].value 
            }, function(err, user) {
                if (err || user) {
                    return done(err, user);
                }
                user = new User({
                    email: profile.emails[0].value,
                    google: profile._json,
                    profile: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        middleName: profile.name.middleName
                    }
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            });
        });
    }));
    
    passport.use(new FacebookTokenStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
    }, function(accessToken, refreshToken, profile, done) {
        User.findOne({
            'facebook.id': profile.id 
        }, function(err, user) {
            if (err || user) {
                return done(err, user);
            }
                
            User.findOne({
                'email': profile.emails[0].value 
            }, function(err, user) {
                if (err || user) {
                    return done(err, user);
                }
                user = new User({
                    email: profile.emails[0].value,
                    facebook: profile._json,
                    profile: {
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        middleName: profile.name.middleName
                    }
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            });
        });
    }));
}
