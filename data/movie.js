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

  if (!response.ok) throw new Error(response.statusText);

  const data = await response.json();

  if (!data) throw new Error('No movie were found');

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

  if (!response.ok) throw new Error(response.statusText);

  const data = await response.json();

  if (!data) throw new Error('No movie were found');

  const results = [];

  for (const movie of data.results) {
    const { id, title, backdrop_path, vote_average } = movie;

    results.push({
      id,
      title,
      backdrop_path,
      vote_average,
    });
  }

  return results;
};

const getMovieDetail = async (id, withCast = false) => {
  const response = await fetch(
    withCast
      ? `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,videos`
      : `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) throw new Error(response.statusText);

  const data = await response.json();

  if (!data) throw new Error('No movie were found');

  const results = {};

  const {
    adult,
    budget,
    genres,
    id: movie_id,
    imdb_id,
    original_language,
    title,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
  } = data;

  const casts = [];
  const videos = [];

  if (withCast) {
    for (const actor of data.credits.cast) {
      const { id, name, profile_path } = actor;

      casts.push({
        id,
        name,
        profile_path,
      });
    }

    for (const video of data.videos.results) {
      const { key, name, site, type } = video;

      videos.push({
        key,
        name,
        site,
        type,
      });
    }
  }

  Object.assign(results, {
    adult,
    budget,
    genres,
    id: movie_id,
    imdb_id,
    original_language,
    title,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
  });

  if (withCast) {
    results.cast = casts;
    results.videos = videos;
  }

  return results;
};

const searchMovies = async (query) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?language=en-US&query=${query}&page=1&include_adult=false&region=id`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) throw new Error(response.statusText);

  const data = await response.json();

  if (!data) throw new Error('No movie were found');

  const results = [];

  for (const movie of data.results) {
    const { id, title, backdrop_path, vote_average } = movie;

    results.push({
      id,
      title,
      backdrop_path,
      vote_average,
    });
  }

  return results;
};

module.exports = {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
  searchMovies,
};
