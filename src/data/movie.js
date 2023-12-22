// const fetch = import('node-fetch');

const ACCESS_TOKEN = process.env.API_ACCESS_TOKEN;

const getPopularMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&region=id`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  const results = [];

  for (const movie of data.results) {
    const { id } = movie;

    const movieDetail = await getMovieDetail(id);
    const {
      adult,
      title,
      vote_average,
      vote_count,
      backdrop_path,
      genres,
      imdb_id,
      runtime,
    } = movieDetail;

    const movieData = {
      id,
      adult,
      title,
      vote_average,
      vote_count,
      backdrop_path,
      genres,
      imdb_id,
      runtime,
    };

    results.push(movieData);
  }

  return results;
};

const getNowPlayingMovies = async () => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&region=id`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  return data.results;
};

const getMovieDetail = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );
  const data = await response.json();

  return data;
};

module.exports = {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
};
