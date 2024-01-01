const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
  searchMovies,
} = require('./data/movie.js');

const app = express();

app.get('/api/popular', async (req, res) => {
  try {
    let { page } = req.query;

    if (!page) page = 1;

    const movies = await getPopularMovies(page);

    console.log(
      `Successfully get popular movies list with ${movies.length} length`
    );

    res.status(200).json(movies);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/now_playing', async (req, res) => {
  try {
    let { page, full } = req.query;

    if (!page) page = 1;
    if (!full) full = false;

    const movies = await getNowPlayingMovies(page);

    console.log(
      `Successfully get now playing movies list with ${movies.length} length`
    );

    res.status(200).json(movies);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await getMovieDetail(id, true);

    console.log(`Successfully fetched movie with id: ${id}`);

    res.status(200).json(movie);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    let { page } = req.query;

    if (!query) {
      throw new Error('Missing query parameter');
    }

    if (!page) page = 1;

    const movies = await searchMovies(query, page);

    console.log(`Successfully fetched movies with query: ${query}`);

    res.status(200).json(movies);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
