import axios from 'axios';
import config from '../config/config.json';
import { clearApplicationData, loadAuthToken, loadUser } from '../utils/localStorage';

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.resolve(error.response);
  }
);

export function login(username, password) {
  return axios.post(`${config.API_URL}/account/login`, {
    username,
    password,
  });
}

export function register(username, email, password) {
  return axios.post(`${config.API_URL}/account/register`, {
    username,
    email,
    password,
  });
}

export async function logout() {
  const user = loadUser();

  if (!user) {
    clearApplicationData();
    return;
  }

  await axios.post(
    `${config.API_URL}/account/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${loadAuthToken()}`,
        'user-id': loadUser().userId,
      },
    }
  );
  clearApplicationData();
}

export function getUser() {
  if (!loadAuthToken()) {
    return;
  }

  const user = loadUser();

  if (user) {
    return user;
  }

  return axios.get(`${config.API_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
}

export function getUsers() {
  if (!loadAuthToken()) {
    return;
  }

  return axios.get(`${config.API_URL}/user/all`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
}

export function updateUser(userId, body) {
  if (!loadAuthToken()) {
    return;
  }

  return axios.put(`${config.API_URL}/user/${userId}/update`, body, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
}

export function updateUserPassword(body) {
  if (!loadAuthToken()) {
    return;
  }

  return axios.put(`${config.API_URL}/user/me/update-password`, body, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
}

export function deleteUser(userId) {
  if (!loadAuthToken()) {
    return;
  }

  return axios.delete(`${config.API_URL}/user/${userId}/delete`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  });
}

export async function loadProfile() {
  if (!loadAuthToken()) {
    return;
  }

  // if (window.profile && buffer) {
  //   const base64Flag = 'data:image/jpeg;base64,';
  //   const imageStr = arrayBufferToBase64(buffer);
  //   return base64Flag + imageStr;
  // }

  return fetch(`${config.API_URL}/user/me/profile`, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
    },
  })
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const base64Flag = 'data:image/jpeg;base64,';
      const imageStr = arrayBufferToBase64(buffer);
      return base64Flag + imageStr;
    });
}

export async function uploadProfileImage(file) {
  if (!loadAuthToken()) {
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${config.API_URL}/user/me/profile`, formData, {
    headers: {
      Authorization: `Bearer ${loadAuthToken()}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
}
