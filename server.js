import express from 'express';
import 'dotenv/config';

import {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
} from './data/movie.js';

const app = express();

app.get('/get_popular', async (req, res) => {
  try {
    const movies = await getPopularMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
  }
});

app.get('/get_now_playing', async (req, res) => {
  try {
    const movies = await getNowPlayingMovies();
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
  }
});

app.get('/get_movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await getMovieDetail(id);
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
