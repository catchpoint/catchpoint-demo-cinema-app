import React, { useEffect } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import Footer from '../../components/Footer';
import PopularMovies from '../../components/PopularMovies';
import RandomMovie from '../../components/RandomMovie';

import { getMovies } from '../../api/movie';

import './Home.css';
import ApplicationContext from '../../context';

const Home = () => {
  const scrollBtn = React.useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollBtn.current.style.display = 'block';
      } else {
        scrollBtn.current.style.display = 'none';
      }
    });

    return () => {
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  return (
    <>
      <RandomMovie />
      <ApplicationContext.Consumer>{({ genres }) => <PopularMovies genres={genres} />}</ApplicationContext.Consumer>
      <Footer />

      <button
        className="scroll-top scroll-to-target"
        data-target="html"
        ref={scrollBtn}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <KeyboardArrowUpIcon />
      </button>
    </>
  );
};

export default Home;
