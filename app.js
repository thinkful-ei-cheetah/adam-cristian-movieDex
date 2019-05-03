'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const MOVIES = require("./movies-data.json");

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting));
app.use(cors());
app.use(helmet());

app.use(function validateToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken !== apiToken) {
    return res
      .status(401)
      .send('Unauthorized request: Must have valid api token.');
  }
  next();
});

app.get('/movie', (req, res) => {
  const {genre = "", country = "", avg_vote} = req.query;

  let result = MOVIES;

  if (genre) {
    result = result.filter(movie => 
      movie
        .genre
        .toLowerCase()
        .includes(genre.toLowerCase()));
  }

  if (country) {
    result = result.filter(movie => 
      movie
        .country
        .toLowerCase()
        .includes(country.toLowerCase()));
  } 

  if (avg_vote) {
    result = result.filter(movie => 
      movie.avg_vote >= (Number(avg_vote)));
  }
  
  res.send(result);
});

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT);