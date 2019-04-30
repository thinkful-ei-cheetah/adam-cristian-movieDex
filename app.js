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

app.use(function validateToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  // did not use bearer ${api-key} to save time. if we had passed in bearer ${api-key} then we wouldve have used split(' ')[i]
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

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});