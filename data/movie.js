const ACCESS_TOKEN = process.env.API_ACCESS_TOKEN;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const GENRES = [
  {
    id: 28,
    name: 'Action',
  },
  {
    id: 12,
    name: 'Abenteuer',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Komödie',
  },
  {
    id: 80,
    name: 'Krimi',
  },
  {
    id: 99,
    name: 'Dokumentarfilm',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Familie',
  },
  {
    id: 14,
    name: 'Fantasy',
  },
  {
    id: 36,
    name: 'Historie',
  },
  {
    id: 27,
    name: 'Horror',
  },
  {
    id: 10402,
    name: 'Musik',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10749,
    name: 'Liebesfilm',
  },
  {
    id: 878,
    name: 'Science Fiction',
  },
  {
    id: 10770,
    name: 'TV-Film',
  },
  {
    id: 53,
    name: 'Thriller',
  },
  {
    id: 10752,
    name: 'Kriegsfilm',
  },
  {
    id: 37,
    name: 'Western',
  },
];

const getPopularMovies = async () => {
  const response = await fetch(
    `${API_BASE_URL}/movie/popular?language=en-US&page=1&region=id`,
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
    `${API_BASE_URL}/movie/now_playing?language=en-US&page=1&region=id`,
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
      ? `${API_BASE_URL}/movie/${id}?language=en-US&append_to_response=credits,videos`
      : `${API_BASE_URL}/movie/${id}?language=en-US`,
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

const searchMovies = async (query, page) => {
  const response = await fetch(
    `${API_BASE_URL}/search/movie?language=en-US&query=${query}&page=${page}&include_adult=true`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  );

  console.log(query, page);

  if (!response.ok) throw new Error(response.statusText);

  const data = await response.json();

  if (!data) throw new Error('No movie were found');

  const results = [];

  for (const movie of data.results) {
    const {
      id,
      adult,
      title,
      backdrop_path,
      vote_average,
      vote_count,
      genre_ids,
    } = movie;
    let genres = getMovieGenres(genre_ids);

    if (genres.length === 0)
      genres = [
        {
          id: null,
          name: 'Unknown',
        },
      ];

    results.push({
      id,
      adult,
      title,
      backdrop_path,
      vote_average,
      vote_count,
      genres,
      imdb_id: null, // imdb_id,
    });
  }

  return results;
};

const getMovieGenres = (genreIds) => {
  const genres = [];

  for (const genreId of genreIds) {
    const genre = GENRES.find((genre) => genre.id === genreId);

    if (genre) {
      genres.push(genre);
    }
  }

  return genres;
};

module.exports = {
  getPopularMovies,
  getNowPlayingMovies,
  getMovieDetail,
  searchMovies,
};
