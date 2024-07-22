const getHourAndMinute = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}h ${minutes}m`;
};

const getYear = (date) => {
  const year = date.split("-")[0];
  return year;
};

const getISODate = (time) => {
  if (!time) return new Date();
  const date = new Date(time);

  return date.toISOString().split("T")[0];
};


const getISODateTime = (timestamp) => {
  const date = new Date(timestamp);

  const datePart = date.toLocaleDateString();
  const timePart = date.toLocaleTimeString();

  return `${datePart} ${timePart}`;
}

const convertDate = (date) => {
  return new Date(date);
}

export {
  getHourAndMinute,
  getYear,
  convertDate,
  getISODate,
  getISODateTime
};