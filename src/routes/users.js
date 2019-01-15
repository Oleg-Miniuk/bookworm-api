import express from 'express';
import User from '../models/user';

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body.user;
  const user = new User({ email });
  user.setPassword(password);
  // TODO: set confirm email
  // user.setConfirmationToken();
  user
    .save()
    .then(userRecord => {
      res.json({
        user: userRecord.toAuthJSON()
      });
    })
    .catch(err => res.json({ err }));
});

export default router;
