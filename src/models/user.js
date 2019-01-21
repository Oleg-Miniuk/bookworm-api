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
    },
    resetPasswordToken: {
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

schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
  this.resetPasswordToken = jwt.sign(
    {
      _id: this._id
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

schema.methods.generateResetPasswordLink = function generateResetPasswordLink() {
  // hardcode for client's data for dev only
  this.generateResetPasswordToken();
  const {
    env: { CLIENT_PORT, CLIENT_HOSTNAME, PROTOCOL }
  } = process;
  return `${PROTOCOL}://${CLIENT_HOSTNAME}:${CLIENT_PORT}/reset_password/${
    this.resetPasswordToken
  }`;
};

schema.plugin(uniqueValidator, {
  message: 'not unique'
});

export default mongoose.model('User', schema);
