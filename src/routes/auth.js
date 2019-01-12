import express from 'express';
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

export default router;
