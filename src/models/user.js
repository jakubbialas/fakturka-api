/**
 * Password hash middleware.
 */
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {UserSettingDef} from "./user-setting";

const UserDef = {
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebook: Array,
    google: Array,
    profile: {
        firstName: String,
        lastName: String,
        middleName: String
    },
    settings: [UserSettingDef],
};

const userSchema = new mongoose.Schema(UserDef, { timestamps: true });

userSchema.pre('save', function save(next) {
  var user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return "https://gravatar.com/avatar/?s=" + size + "&d=retro";
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return "https://gravatar.com/avatar/" + md5 + "?s=" + size + "&d=retro";
};

const User = mongoose.model('User', userSchema);

export {User, UserDef};