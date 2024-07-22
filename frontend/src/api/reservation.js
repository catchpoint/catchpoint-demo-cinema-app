import axios from 'axios';
import { API_URL } from '../config/config.json';
import { loadAuthToken } from '../utils/localStorage';

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.resolve(error.response);
  }
);

export async function getAllReservations(filter) {
  const response = await axios.get(
    `${API_URL}/reservation/all${
      Object.keys(filter).length > 0
        ? `?${Object.keys(filter)
            .map((key) => `${key}=${filter[key]}`)
            .join('&')}`
        : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${loadAuthToken()}`,
      },
    }
  );

  return {
    content: response.data,
    count: response.headers['x-total-count'],
  };
}

export async function getReservations(filter) {
  const response = await axios.get(
    `${API_URL}/reservation/${
      Object.keys(filter).length > 0
        ? `?${Object.keys(filter)
            .map((key) => `${key}=${filter[key]}`)
            .join('&')}`
        : ''
    }`,
    {
      headers: {
        Authorization: `Bearer ${loadAuthToken()}`,
      },
    }
  );

  return {
    content: response.data,
    count: response.headers['x-total-count'],
  };
}

export async function deleteReservation(reservationId) {
  const response = await axios.delete(`${API_URL}/reservation/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function getTotalRevenue() {
  const response = await axios.get(`${API_URL}/reservation/revenue`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function getDailyRevenue() {
  const response = await axios.get(`${API_URL}/reservation/daily-revenue`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function getSoldTicketCount() {
  const response = await axios.get(`${API_URL}/reservation/sold-tickets`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function getTicketCount() {
  const response = await axios.get(`${API_URL}/reservation/ticket-count`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}

export async function getMostSoldMovie() {
  const response = await axios.get(`${API_URL}/reservation/most-sold-movie`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });

  return response.data;
}

export async function getLeastSoldMovie() {
  const response = await axios.get(`${API_URL}/reservation/least-sold-movie`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });

  return response.data;
}

export async function getReservation(id) {
  const response = await axios.get(`${API_URL}/reservation/${id}`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
  return response.data;
}
