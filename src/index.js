import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import auth from './routes/auth';
import users from './routes/users';
import books from './routes/books';

// config
dotenv.config();

//  DB
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true }
);

const app = express();

// body-parser
app.use(bodyParser.json());

// routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/books', books);

// static
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// run
app.listen(process.env.PORT, console.log('server is on 4041'));
