import React, { memo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { produce } from 'immer';

import { Alert, Snackbar } from '@mui/material';

import NoPage from './pages/NoPage';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';

import Header from './components/Header';

import ApplicationContext from './context';

import { getGenres } from './api/movie';
import { getUser, login, logout, register } from './api/user';

import { handleScroll } from './utils/resize';
import { addItem, loadAuthToken, loadUser } from './utils/localStorage';

import './App.css';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard/Dashboard';
import FavoriteMovies from './pages/FavoriteMovies';
import Reservations from './pages/Reservations';

const routeWithAuth = (element, authElement) => {
  return (
    <ApplicationContext.Consumer>
      {(context) => {
        return context.isAuth ? authElement : element;
      }}
    </ApplicationContext.Consumer>
  );
};

const produceContext = (setContext, fn) => {
  setContext(
    produce((draft) => {
      fn(draft);
    })
  );
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [context, setContext] = React.useState({
    isAuth: loadAuthToken() && loadUser() ? true : false,
    isNavTransparent: true,
    snackBarMessage: '',
    snackBarOpen: false,
    genres: [],

    showSnackBar: (message, messageType) =>
      produceContext(setContext, (draft) => {
        draft.snackBarMessage = message;
        draft.snackBarMessageType = messageType;
        draft.snackBarOpen = true;
      }),

    closeSnackBar: () =>
      produceContext(setContext, (draft) => {
        draft.snackBarMessage = '';
        draft.snackBarOpen = false;
      }),

    login: async (username, password) => {
      if (!username || !password) {
        context.showSnackBar('Please enter username and password', 'error');
        return;
      }

      let response;

      try {
        response = await login(username, password);
      } catch (error) {
        response = error.response;
      }

      if (response && response.status === 200 && response.data) {
        const { token, userId, user, profile } = response.data;
        addItem('auth_token', token);
        addItem('user', { ...user, userId });
        window.profile = profile

        context.showSnackBar('Login successful', 'success');

        produceContext(setContext, (draft) => {
          draft.isAuth = true;
        });

        navigate(location.pathname === '/login' ? '/' : location.pathname, {
          replace: true,
        });
      } else {
        context.showSnackBar('Login failed check username and password', 'error');
      }
    },
    logout: async () => {
      await logout();

      produceContext(setContext, (draft) => {
        draft.isAuth = false;
      });

      context.showSnackBar('Logout successful', 'success');
    },

    register: async (username, email, password) => {
      const response = await register(username, email, password);
      if (response.status === 200 && response.data) {
        context.showSnackBar('Register successful', 'success');
        navigate('/login', { replace: true });
      }
    },

    enableNavTransparent: (flag) => {
      produceContext(setContext, (draft) => {
        draft.isNavTransparent = flag;
      });
    },
  });

  useEffect(() => {
    const fetchGenres = async () => {
      const genres = await getGenres();
      genres.push({ genreId: 0, name: 'All' });

      genres.sort((a, b) => {
        if (a.genreId === 0) return -1;
        if (b.genreId === 0) return 1;
        return a.name > b.name ? 1 : -1;
      });

      produceContext(setContext, (draft) => {
        draft.genres = genres;
      });
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', () => handleScroll(window.scrollY > 0, context));
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <ApplicationContext.Provider value={context}>
        {location.pathname !== '/dashboard' ? <Header /> : null}
        <Routes>
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={routeWithAuth(<Authentication login />, <Home />)} />
          <Route path="/register" element={routeWithAuth(<Authentication />, <Home />)} />
          <Route path="/checkout/:id" element={routeWithAuth(<Authentication login />, <Checkout />)} />

          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={routeWithAuth(<Authentication login />, <FavoriteMovies />)} />
          <Route path="/reservations" element={routeWithAuth(<Authentication login />, <Reservations />)} />

          {loadUser() && loadUser().role.toLowerCase() !== 'user' && <Route path="/dashboard" element={<Dashboard />} />}
          <Route path="*" element={<NoPage />} />
        </Routes>

        <Snackbar
          open={context.snackBarOpen}
          autoHideDuration={6000}
          onClose={context.closeSnackBar}
          sx={{
            width: '20%',
          }}
        >
          <Alert onClose={context.closeSnackBar} severity={context.snackBarMessageType} sx={{ width: '100%' }}>
            {context.snackBarMessage}
          </Alert>
        </Snackbar>
      </ApplicationContext.Provider>
    </>
  );
}
export default memo(App);
