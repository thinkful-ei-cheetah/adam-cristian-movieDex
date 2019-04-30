'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const MOVIES = require("./movies-data.json")

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateHeader(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken !== apiToken) {
    return res
      .status(401)
      .send('Unauthorized request: Must have valid api token.')
  }

  next()
})

app.get('/movie', (req, res) => {
  const {genre = "", country = "", avg_vote} = req.query

  let result = MOVIES;

  if (genre) {
    result = result.filter(movie => 
      movie
        .genre
        .toLowerCase()
        .includes(genre.toLowerCase()))
  }

  if (country) {
    result = result.filter(movie => 
      movie
        .country
        .toLowerCase()
        .includes(country.toLowerCase()))
  } 

  if (avg_vote) {
    result = result.filter(movie => 
      movie.avg_vote >= (Number(avg_vote)))
  }
  
  res.send(result)
});

app.listen(8000, () => {
  console.log('Running on port 8000');
});