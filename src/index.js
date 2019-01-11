import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import auth from './routes/auth';

mongoose.connect(
  'mongodb://localhost/bookworn',
  { useNewUrlParser: true }
);

const app = express();

// body-parser
app.use(bodyParser.json());

// routes
app.use('/api/auth', auth);

// static
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// run
app.listen(4041, console.log('server is on 4041'));
