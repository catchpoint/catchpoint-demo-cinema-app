const getMovieCount = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return Math.floor(width / 208) * (Math.floor(height / 200) - 1);
};

const calcPage = (page) => {
  const count = getMovieCount();
  if (page === 1) {
    return [0, count];
  }

  return [(page - 1) * count, page * count];
};

const handleScroll = (isScroll, context) => {
  if (isScroll) {
    context.enableNavTransparent(false);
  } else {
    context.enableNavTransparent(true);
  }
};

export { getMovieCount, calcPage, handleScroll };
