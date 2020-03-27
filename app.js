/* eslint-disable quotes */
require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const movies = require("./movies.js");
const cors = require("cors");

const app = express();

const API_TOKEN = process.env.API_TOKEN;

app.use(morgan("dev"));
app.use(cors());
app.use(validateAuthorization);

console.log(API_TOKEN);

function checkSearch(term, string) {
  return string.includes(term);
}

function handleGenre(req, res, movies) {
  const genre = req.query.genre.toLowerCase();
  console.log(genre);
  const filteredMovies = movies.filter(movie =>
    checkSearch(genre, movie.genre.toLowerCase())
  );
  return filteredMovies;
}

function handleCountry(req, res, movies) {
  const country = req.query.country.toLowerCase();
  const filteredMovies = movies.filter(movie =>
    checkSearch(country, movie.country.toLowerCase())
  );
  return filteredMovies;
}

function handleAverage(req, res, movies) {
  let { avg_vote } = req.query;
  avg_vote = Number(avg_vote);
  const filteredMovies = movies.filter(
    movie => Number(movie.avg_vote) >= avg_vote
  );
  return filteredMovies;
}

function validateAuthorization(req, res, next) {
  const authValue = req.get("Authorization");
  if (authValue === undefined) {
    return res.status(400).json({ error: "Authorization header missing" });
  }
  if (!authValue.toLowerCase().startsWith("bearer")) {
    return res.status(400).json({
      error: "Invalid authorization. auth code must use Bearer strategy"
    });
  } else if (!(authValue === `Bearer ${API_TOKEN}`)) {
    return res.status(400).json({ error: "invalid api token" });
  }
  next();
}

app.get("/movie", (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let filteredMovies = movies;
  if (genre) {
    filteredMovies = handleGenre(req, res, filteredMovies);
  }
  if (country) {
    filteredMovies = handleCountry(req, res, filteredMovies);
  }
  if (avg_vote) {
    filteredMovies = handleAverage(req, res, filteredMovies);
  }
  return res.json(filteredMovies);
});

module.exports = app;
