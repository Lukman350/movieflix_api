const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
} = require('./data/movie.js');

const app = express();

app.get('/api/get_popular', async (req, res) => {
  try {
    const movies = await getPopularMovies();

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

app.get('/api/get_now_playing', async (req, res) => {
  try {
    const movies = await getNowPlayingMovies();

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

app.get('/api/get_movie/:id', async (req, res) => {
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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
