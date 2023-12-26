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
      ? `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits`
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
    overview,
    poster_path,
    runtime,
    vote_average,
  } = data;

  const casts = [];

  if (withCast) {
    for (const actor of data.credits.cast) {
      const { id, name, profile_path } = actor;

      casts.push({
        id,
        name,
        profile_path,
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
    overview,
    poster_path,
    runtime,
    vote_average,
  });

  if (withCast) results.cast = casts;

  return results;
};

module.exports = {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
};
