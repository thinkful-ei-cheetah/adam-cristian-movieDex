'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use((req, res) => {
  console.log(process.env.API_TOKEN);
  res.send('Howdy');
});

app.listen(8000, () => {
  console.log('Running on port 8000');
});