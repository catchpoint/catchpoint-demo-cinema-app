import React, { useEffect } from "react";
import { Container, Grid, Link, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ScheduleIcon from "@mui/icons-material/Schedule";

import Section from "../Section";
import TrailerModal from "../TrailerModal";
import { convertDate, getHourAndMinute } from "../../utils/date";
import { blue } from "@mui/material/colors";
import { getRandomMovie } from "../../api/movie";

const styles = {
  primary: {
    color: blue[500],
  },
};

const RandomMovie = () => {
  const [movie, setMovie] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchRandomMovie = async () => {
      const randomMovie = await getRandomMovie();
      setMovie(randomMovie);
    };

    fetchRandomMovie();

    return () => {
      setMovie(null);
    };
  }, []);

  return (
    <Section
      id="recommend"
      bgImage={ movie?.backdropPath ? `https://image.tmdb.org/t/p/original${movie?.backdropPath}` : "/no-image.jpg"}
      height="100vh"
      opacity={0.3}
    >
      <Container maxWidth="m">
        <Typography
          variant="h6"
          component="h6"
          sx={{
            color: styles.primary.color,
            fontSize: "26px",
            fontWeight: "800",
          }}
          mb={2}
        >
          {movie?.title}
        </Typography>

        <Typography
          variant="h2"
          component="h1"
          sx={{ color: "#fff", fontWeight: "700" }}
          mb={2}
        >
          Book your movie ticket now!
        </Typography>

        <Grid
          container
          sx={{
            width: "100%",
            height: "50px",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          <Grid item sx={{ width: "max-content" }} mr={2}>
            <span className="movie-details pegi">
              {movie?.language?.toUpperCase()}
            </span>
          </Grid>
          <Grid item sx={{ width: "max-content" }} mr={2}>
            <span className="movie-details quality">{movie?.rating * 10}%</span>
          </Grid>
          <Grid item sx={{ width: "max-content" }} mr={2}>
            <span className="movie-details">
              {movie?.genres.map((genre) => genre.name).join(", ")}
            </span>
          </Grid>
          <Grid item sx={{ width: "max-content" }} mr={1}>
            <span className="movie-details">
              <CalendarMonthIcon sx={{ fontSize: "18px" }} />
              {convertDate(movie?.releaseDate).getFullYear()}
            </span>
          </Grid>
          <Grid item sx={{ width: "max-content" }} mr={1}>
            <span className="movie-details">
              <ScheduleIcon sx={{ fontSize: "18px" }} />
              {getHourAndMinute(movie?.runtime)}
            </span>
          </Grid>
        </Grid>

        <Grid
          container
          sx={{
            width: "100%",
            height: "50px",
            mt: 2,
          }}
        >
          <Grid item mr={2}>
            <Link
              href={`/checkout/${movie?.movieId}`}
              underline="none"
              sx={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: "600",
                backgroundColor: styles.primary.color,
                padding: "10px",
                borderRadius: "5px",
                transition: "all 0.3s ease-in-out",
                gap: "3px",
                width: "max-content",

                ["&:hover"]: {
                  backgroundColor: "#fff",
                  color: styles.primary.color,
                },
              }}
            >
              <ConfirmationNumberIcon
                sx={{ verticalAlign: "sub", marginRight: "4px" }}
              />
              Buy Ticket
            </Link>
          </Grid>
          {movie && movie.trailerLink && (
            <Grid item mr={2}>
              <Link
                underline="none"
                sx={{
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "600",
                  border: "2px solid " + styles.primary.color,
                  padding: "8px 10px",
                  borderRadius: "5px",
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer",
                  ["&:hover"]: {
                    backgroundColor: "#fff",
                    color: styles.primary.color,
                  },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                Watch Trailer
              </Link>
            </Grid>
          )}
        </Grid>
      </Container>
      {movie && movie.trailerLink && (
        <TrailerModal
          trailUrl={movie.trailerLink.replace("watch?v=", "embed/")}
          open={open}
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}
    </Section>
  );
};

export default RandomMovie;
