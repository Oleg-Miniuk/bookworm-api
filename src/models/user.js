import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// TODO: add uniqueness and email validations to email field
const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
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

schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    token: this.generateJWT()
  };
};

export default mongoose.model('User', schema);
