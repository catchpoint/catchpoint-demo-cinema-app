const textSearch = (str, search, isCaseSensitive = false) => {
  if (!str || !search) {
    return false;
  }

  if (!isCaseSensitive) {
    str = str.toLowerCase();
    search = search.toLowerCase();
  }

  return str.includes(search);
};

const addNewLine = (str, positions) => {
  if (!str || !positions) {
    return str;
  }

  let newStr = str;

  for (let i = 0; i < str.length; i++) {
    if ((i + 1) % positions === 0) {
      newStr = newStr.slice(0, i) + '\n' + newStr.slice(i);
    }
  }

  return newStr;

};



export {
  textSearch,
  addNewLine
};