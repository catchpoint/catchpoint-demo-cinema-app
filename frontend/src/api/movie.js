import axios from 'axios';
import { API_URL } from '../config/config.json';
import { loadAuthToken, loadUser } from '../utils/localStorage';

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.resolve(error.response);
  }
);

export async function getMovies(filter) {
  const response = await axios.get(
    `${API_URL}/movie/all?${
      filter
        ? Object.keys(filter)
            .filter((key) => !!filter[key])
            .map((key) => `${key}=${filter[key]}`)
            .join('&')
        : ''
    }`
  );

  return response.data;
}

export async function getMovie(id) {
  const response = await axios.get(`${API_URL}/movie/${id}`);
  return response.data;
}

export async function getGenres() {
  const response = await axios.get(`${API_URL}/movie/genres`, {});
  return response.data;
}

export async function getRandomMovie() {
  const response = await axios.get(`${API_URL}/movie/random`);
  return response.data;
}

export async function getPopularMovies(filter) {
  const response = await axios.get(
    `${API_URL}/movie/popular?${
      filter
        ? Object.keys(filter)
            .map((key) => `${key}=${filter[key]}`)
            .join('&')
        : ''
    }`
  );
  return response.data;
}

export async function search(filter) {
  const response = await axios.get(
    `${API_URL}/movie/search?${
      filter
        ? Object.keys(filter)
            .map((key) => `${key}=${filter[key]}`)
            .join('&')
        : ''
    }`
  );

  return response.data;
}

export async function getMovieCount(genreId) {
  const response = await axios.get(`${API_URL}/movie/count?genre_id=${genreId}`);
  return response.data;
}

export async function getMovieCountByQuery(query) {
  const response = await axios.get(`${API_URL}/movie/count/search?query=${query}`);
  return response.data;
}

export async function getOnshowMovieCount() {
  if (!loadAuthToken()) {
    return;
  }

  const response = await axios.get(`${API_URL}/movie/onshow/count`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function getMovieCast(id) {
  const response = await axios.get(`${API_URL}/movie/${id}/cast`);
  return response.data;
}

export async function getMovieComments(id, filter) {
  const response = await axios.get(
    `${API_URL}/movie/${id}/comments?${
      filter
        ? Object.keys(filter)
            .map((key) => `${key}=${filter[key]}`)
            .join('&')
        : ''
    }`
  );
  return [response.headers['x-total-count'], response.data];
}

export async function createMovie(movie) {
  if (!loadAuthToken()) {
    return;
  }

  movie = {
    ...movie,
    keywords: movie.keywords?.split(',').map((keyword) => keyword.trim()),
  };

  const response = await axios.post(`${API_URL}/movie/`, movie, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function updateMovie(movie) {
  if (!loadAuthToken()) {
    return;
  }

  movie = {
    ...movie,
    keywords: movie.keywords?.split(',').map((keyword) => keyword.trim()),
  };

  const response = await axios.put(`${API_URL}/movie/${movie.movieId}`, movie, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function deleteMovie(movieId) {
  if (!loadAuthToken()) {
    return;
  }

  const response = await axios.delete(`${API_URL}/movie/${movieId}`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function checkFavoriteMovie(movieId) {
  if (!loadUser()) return [];

  const favoriteMovies = await getFavoriteMovies();

  return favoriteMovies.filter((m) => m.movieId === movieId);
}

export async function getFavoriteMovies() {
  if (!loadUser()) return [];

  const response = await axios.get(`${API_URL}/movie/favorites`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function addFavoriteMovie(movieId) {
  if (!loadAuthToken()) {
    return;
  }

  const response = await axios.put(
    `${API_URL}/movie/favorites?movie_id=${movieId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${loadAuthToken()}`,
      },
    }
  );
  return response.data;
}

export async function removeFavoriteMovie(movieId) {
  if (!loadAuthToken()) {
    return;
  }

  const response = await axios.delete(`${API_URL}/movie/favorites?movie_id=${movieId}`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function addComment(movieId, comment) {
  if (!loadAuthToken()) {
    return;
  }

  const response = await axios.post(
    `${API_URL}/movie/comments`,
    {
      movieId,
      comment,
    },
    {
      headers: {
        Authorization: `Bearer ${loadAuthToken()}`,
      },
    }
  );

  return response.data;
}

export async function deleteComment(commentId) {
  if (!loadAuthToken()) {
    return;
  }

  const response = await axios.delete(`${API_URL}/movie/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });

  return response.data;
}
