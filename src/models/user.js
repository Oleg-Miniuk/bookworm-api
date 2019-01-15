import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    confirmed: {
      type: Boolean,
      default: false
    },
    confirmationToken: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

schema.methods.isValidPassword = function isValidPassword(password) {
  const hash = crypto
    .createHash('sha1')
    .update(password)
    .digest('hex');
  return hash === this.passwordHash;
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email
    },
    process.env.JWT_SECRET
  );
};

schema.methods.setConfirmationToken = function setConfirmationToken() {
  this.confirmationToken = this.generateJWT();
};

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    confirmed: this.confirmed,
    token: this.generateJWT()
  };
};

schema.methods.setPassword = function setPassowrd(password) {
  this.passwordHash = crypto
    .createHash('sha1')
    .update(password)
    .digest('hex');
};

schema.plugin(uniqueValidator, {
  message: 'not unique'
});

export default mongoose.model('User', schema);
