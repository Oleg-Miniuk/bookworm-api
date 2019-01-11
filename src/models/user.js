import mongoose from 'mongoose';
import crypto from 'crypto';

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

// schema.methods.isValidPassword = password => bcrypt.compareSync(password, schema.passwordHash);

export default mongoose.model('User', schema);
