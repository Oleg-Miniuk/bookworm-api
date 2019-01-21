import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = express.Router();

router.post('/', (req, res) => {
  const {
    credentials: { email, password }
  } = req.body;
  User.findOne({
    email
  }).then(user => {
    if (user && user.isValidPassword(password)) {
      res.json({
        user: user.toAuthJSON()
      });
    } else {
      res.status(400).json({
        errors: {
          global: 'Invalid credentials'
        }
      });
    }
  });
});

router.post('/reset_password_request', (req, res) => {
  const {
    body: { email }
  } = req;
  User.findOne({ email })
    .then(user => {
      if (user) {
        // TODO: send resetPassword email
        // TODO: remove url from response
        const link = user.generateResetPasswordLink();
        // End of TODO
        res.json({ link });
        // End of TODO
      } else {
        res.status(409).json({
          errors: {
            global: 'There is no user with such email'
          }
        });
      }
    })
    .catch(err => console.log(err));
});

router.post('/reset_password', (req, res) => {
  const {
    body: { password, token }
  } = req;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({});
    } else {
      User.findOne({
        _id: decoded._id
      }).then(user => {
        if (user) {
          user.setPassword(password);
          user.save().then(() => res.json());
        } else {
          res.status(404).json({
            errors: {
              global: 'Invalid token'
            }
          });
        }
      });
      res.json({ success: true, result: 'password changed' });
    }
  });
});

router.post('/validate_token', (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, err => {
    if (err) {
      res.status(401).json({});
    } else {
      res.json({ success: true });
    }
  });
});

export default router;
