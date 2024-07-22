package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.model.movie.*;
import com.sqlcinema.backend.model.order.MovieOrder;
import com.sqlcinema.backend.model.request.MovieRequest;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.sqlcinema.backend.common.Constants.createObjectArray;
import static com.sqlcinema.backend.common.Constants.getCurrentUser;

@Repository
@AllArgsConstructor
public class MovieRepository {
    private final JdbcTemplate jdbcTemplate;
    private final CustomLogger logger;

    private int getUserId() {
        UserAccount currentUser = getCurrentUser();
        return currentUser != null ? currentUser.getUserId() : 0;
    }

    public List<Genre> getGenres() {
        String query = "SELECT * FROM Genre";
        logger.sqlLog(query);
        try {
            return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(Genre.class));
        } catch (DataAccessException ignored) {
            return new ArrayList<>();
        }
    }

    public void addGenres(Movie movie) {
        String genreQuery = "SELECT * FROM Genre WHERE genre_id IN (SELECT genre_id FROM MovieGenre WHERE movie_id = ?)";

        movie.setGenres(jdbcTemplate.query(genreQuery,
                BeanPropertyRowMapper.newInstance(Genre.class), movie.getMovieId()));

        movie.setTags();
    }
    
    public void addCast(Movie movie) {
        String personQuery = "SELECT person_id FROM Person WHERE person_id IN " +
                "(SELECT person_id FROM ActorCredit WHERE movie_id = ?) " +
                "OR person_id IN (SELECT person_id FROM CrewCredit WHERE movie_id = ?)";
        
        List<Integer> personIds = jdbcTemplate.queryForList(personQuery, Integer.class, 
                movie.getMovieId(), movie.getMovieId());
        
        movie.setCast(new ArrayList<>());
        
        for (Integer personId : personIds) {
            String actorQuery = "SELECT * FROM ActorCredit INNER JOIN Person " +
                    "ON ActorCredit.person_id = Person.person_id WHERE ActorCredit.movie_id = ? AND Person.person_id = ?";
            String crewQuery = "SELECT * FROM CrewCredit INNER JOIN Person " +
                    "ON CrewCredit.person_id = Person.person_id WHERE CrewCredit.movie_id = ? AND Person.person_id = ?";
            
            try {
                Person cast = jdbcTemplate.queryForObject(actorQuery, BeanPropertyRowMapper.newInstance(Cast.class),
                        movie.getMovieId(), personId);
                movie.getCast().add(cast);
            } catch (Exception ignored) {
            }
            
            try {
                Person crew = jdbcTemplate.queryForObject(crewQuery, BeanPropertyRowMapper.newInstance(Crew.class),
                        movie.getMovieId(), personId);
                movie.getCast().add(crew);
            } catch (Exception ignored) {
            }
        }
    }

    public List<Movie> getMovies(int page, int size, int genreId, MovieOrder orderBy) {
        String query = "SELECT Movie.*, KeywordSet.keywords, " +
                "EXISTS(SELECT * FROM FavoriteMovie WHERE user_id = ? AND movie_id = Movie.movie_id) as favorite " +
                "FROM Movie " +
                "LEFT JOIN KeywordSet ON Movie.movie_id = KeywordSet.movie_id " +
                (genreId != 0 ? "INNER JOIN MovieGenre ON Movie.movie_id = MovieGenre.movie_id " : "") +
                (genreId != 0 ? "WHERE MovieGenre.genre_id = ? " : "") +
                (orderBy != null && !orderBy.getValue().isEmpty() ? "ORDER BY " + orderBy.getValue() + " " : " ") +
                "LIMIT ? OFFSET ?";

        logger.sqlLog(query);

        List<Integer> params = new ArrayList<>();

        params.add(getUserId());
        if (genreId != 0) {
            params.add(genreId);
        }
        params.add(size);
        params.add((page - 1) * size);

        List<Movie> movies = jdbcTemplate.query(query,
                BeanPropertyRowMapper.newInstance(Movie.class),
                params.toArray());

        for (Movie movie : movies) {
            addGenres(movie);
        }

        return movies;
    }

    public Movie getMovieById(int id) {
        try {
            String query = "SELECT Movie.*, KeywordSet.keywords, " +
                    "EXISTS(SELECT * FROM FavoriteMovie WHERE user_id = ? AND movie_id = Movie.movie_id) as favorite " +
                    "FROM Movie " +
                    "LEFT JOIN KeywordSet ON Movie.movie_id = KeywordSet.movie_id " +
                    "WHERE Movie.movie_id = ?";
            logger.sqlLog(query, createObjectArray(id));

            Movie movie = jdbcTemplate.queryForObject(query, BeanPropertyRowMapper.newInstance(Movie.class),
                    getUserId(), id);
            if (movie == null) {
                return null;
            }

            addGenres(movie);
            addCast(movie);
            return movie;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Movie randomMovie() {
        String query = "SELECT Movie.*, KeywordSet.keywords, " +
                "EXISTS(SELECT * FROM FavoriteMovie WHERE user_id = ? AND movie_id = Movie.movie_id) as favorite " +
                "FROM Movie " +
                "LEFT JOIN KeywordSet ON Movie.movie_id = KeywordSet.movie_id " +
                "ORDER BY RAND() LIMIT 1";

        logger.sqlLog(query, createObjectArray(getUserId()));
        
        Movie movie = jdbcTemplate.queryForObject(query,
                BeanPropertyRowMapper.newInstance(Movie.class),
                getUserId());
        
        if (movie == null) {
            return null;
        }
        
        addGenres(movie);
        return movie;
    }

    public List<Movie> searchMovies(int page, int size, String query) {
        String searchQuery = "SELECT Movie.*, KeywordSet.keywords, " +
                "EXISTS(SELECT * FROM FavoriteMovie WHERE user_id = ? AND movie_id = Movie.movie_id) as favorite " +
                "FROM Movie " +
                "LEFT JOIN KeywordSet ON Movie.movie_id = KeywordSet.movie_id " +
                "WHERE KeywordSet.keywords LIKE ? " +
                "OR Movie.title LIKE ? " +
                "OR Movie.overview LIKE ? " +
                "LIMIT ? OFFSET ?";

        logger.sqlLog(searchQuery, createObjectArray(getUserId(), query, query, query, size, (page - 1) * size));

        List<Movie> movies = jdbcTemplate.query(searchQuery,
                BeanPropertyRowMapper.newInstance(Movie.class),
                getUserId(), query, query, query, size, (page - 1) * size);

        for (Movie movie : movies) {
            addGenres(movie);
        }

        return movies;
    }

    public int addMovie(MovieRequest movie) {
        movie.setTags();
        String query = "CALL create_movie(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        logger.sqlLog(query, createObjectArray(movie.toString()));

        jdbcTemplate.update(query, movie.getTitle(), movie.getRuntime(), movie.getOverview(), movie.getPosterPath(),
                movie.getBackdropPath(), movie.getReleaseDate(), movie.getRating(), movie.getTrailerLink(),
                movie.getCountry(), movie.getLanguage(), movie.getGenres().get(0).getName());

        for (int i = 1; i < movie.getGenres().size(); i++) {
            query = "CALL assign_movie_genre(?, ?)";
            logger.sqlLog(query, createObjectArray(movie.getTitle(), movie.getGenres().get(i).getName()));
            jdbcTemplate.update(query, movie.getTitle(), movie.getGenres().get(i).getName());
        }


        if (movie.getActors() != null) {
            for (Map.Entry<String, String> actor : movie.getActors().entrySet()) {
                query = "CALL assign_actor(?, ?, ?)";
                logger.sqlLog(query, createObjectArray(movie.getTitle(), actor.getKey(), actor.getValue()));
                jdbcTemplate.update(query, movie.getTitle(), actor.getKey(), actor.getValue());
            }
        }

        if (movie.getCrews() != null) {
            for (Map.Entry<String, String> crew : movie.getCrews().entrySet()) {
                query = "CALL assign_crew(?, ?, ?)";
                logger.sqlLog(query, createObjectArray(movie.getTitle(), crew.getKey(), crew.getValue()));
                jdbcTemplate.update(query, movie.getTitle(), crew.getKey(), crew.getValue());
            }
        }

        if (movie.getKeywordSet() != null) {
            String keywords = String.join(",", movie.getKeywordSet());
            query = "CALL create_keyword_set(?, ?, TRUE)";
            logger.sqlLog(query, createObjectArray(movie.getTitle(), keywords));
            jdbcTemplate.update(query, movie.getTitle(), keywords);
        }

        String getMovieId = "SELECT movie_id FROM Movie WHERE title = ?";
        logger.sqlLog(getMovieId, createObjectArray(movie.getTitle()));

        return jdbcTemplate.queryForObject(getMovieId, Integer.class, movie.getTitle());
    }

    public int getMovieCount(int genreId) {
        String query = "SELECT COUNT(*) FROM Movie " +
                (genreId != 0 ? "INNER JOIN MovieGenre ON Movie.movie_id = MovieGenre.movie_id " : "") +
                (genreId != 0 ? "WHERE MovieGenre.genre_id = ? " : "");

        logger.sqlLog(query);
        return genreId == 0 ? jdbcTemplate.queryForObject(query, Integer.class) :
                jdbcTemplate.queryForObject(query, Integer.class, genreId);
    }

    public int getMovieCountByQuery(String query) {
        String searchQuery = "SELECT COUNT(*) FROM Movie m LEFT JOIN KeywordSet k ON m.movie_id = k.movie_id " +
                "WHERE k.keywords LIKE ? " +
                "OR m.title LIKE ? " +
                "OR m.overview LIKE ?";

        logger.sqlLog(searchQuery);
        return jdbcTemplate.queryForObject(searchQuery, Integer.class, query, query, query);
    }

    public void deleteMovie(int movieId) {
        String query = "CALL delete_movie(?)";
        logger.sqlLog(query, createObjectArray(movieId));
        jdbcTemplate.update(query, movieId);
    }

    public void updateMovie(int movieId, MovieRequest movie) {
        logger.info("Updating movie with id: " + movieId);

        String query = "CALL update_movie(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        logger.sqlLog(query, createObjectArray(movieId, movie.toString()));

        jdbcTemplate.update(query, movieId, movie.getTitle(), movie.getRuntime(), movie.getOverview(), movie.getPosterPath(),
                movie.getBackdropPath(), movie.getReleaseDate(), movie.getTrailerLink(),
                movie.getCountry(), movie.getLanguage());

        query = "DELETE FROM MovieGenre WHERE movie_id = ?";
        logger.sqlLog(query, createObjectArray(movieId));
        jdbcTemplate.update(query, movieId);

        for (Genre genre : movie.getGenres()) {
            query = "CALL assign_movie_genre(?, ?)";
            logger.sqlLog(query, createObjectArray(movieId, genre.getName()));
            jdbcTemplate.update(query, movie.getTitle(), genre.getName());
        }

        if (movie.getKeywordSet() != null) {
            String keywords = String.join(",", movie.getKeywordSet());
            query = "CALL create_keyword_set(?, ?, FALSE)";
            logger.sqlLog(query, createObjectArray(movie.getTitle(), keywords));
            jdbcTemplate.update(query, movie.getTitle(), keywords);
        }
    }

    public List<Person> getPeople(int movieId) {

        List<Person> cast = new ArrayList<>();
        String actorQuery = "SELECT * FROM ActorCredit INNER JOIN Person " +
                "ON ActorCredit.person_id = Person.person_id WHERE movie_id = ?";

        logger.sqlLog(actorQuery, createObjectArray(movieId));

        String crewQuery = "SELECT * FROM CrewCredit INNER JOIN Person " +
                "ON CrewCredit.person_id = Person.person_id WHERE movie_id = ?";
        logger.sqlLog(crewQuery, createObjectArray(movieId));

        try {
            cast.addAll(jdbcTemplate.query(actorQuery, BeanPropertyRowMapper.newInstance(Cast.class), movieId));
        } catch (Exception ignored) {
        }

        try {
            cast.addAll(jdbcTemplate.query(crewQuery, BeanPropertyRowMapper.newInstance(Crew.class), movieId));
        } catch (Exception ignored) {
        }

        return cast;
    }

    public List<MovieComment> getComments(int movieId, int page, int size) {
        String query = "SELECT m.*, ua.username FROM UserMovieComment m INNER JOIN UserAccount ua " +
                "ON m.user_id = ua.user_id WHERE m.movie_id = ? " +
                "ORDER BY m.comment_at DESC LIMIT ? OFFSET ?";

        logger.sqlLog(query, createObjectArray(movieId, size, (page - 1) * size));
        try {
            return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(MovieComment.class), movieId, size, (page - 1) * size);
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public int getCommentCount(int movieId) {
        String query = "SELECT COUNT(*) FROM UserMovieComment WHERE movie_id = ?";
        logger.sqlLog(query, createObjectArray(movieId));
        try {
            return jdbcTemplate.queryForObject(query, Integer.class, movieId);
        } catch (Exception e) {
            return 0;
        }
    }

    public String getKeywords(int movieId) {
        String query = "SELECT keywords FROM KeywordSet WHERE movie_id = ?";
        logger.sqlLog(query, createObjectArray(movieId));
        try {
            return jdbcTemplate.queryForObject(query, String.class, movieId);
        } catch (Exception e) {
            return null;
        }
    }

    public int getOnShowMovieCount() {
        String query = "SELECT COUNT(*) FROM Movie WHERE release_date <= NOW()";
        logger.sqlLog(query);

        try {
            return jdbcTemplate.queryForObject(query, Integer.class);
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean checkFavoriteMovie(int userId, int movieId) {
        String query = "SELECT EXISTS(SELECT * FROM FavoriteMovie WHERE user_id = ? AND movie_id = ?)";
        return jdbcTemplate.queryForObject(query, Boolean.class, userId, movieId);
    }

    public List<Movie> getUserFavoriteMovies(int userId) {
        String query = "SELECT Movie.*, KeywordSet.keywords, " +
                "EXISTS(SELECT * FROM FavoriteMovie WHERE user_id = ? AND movie_id = Movie.movie_id) as favorite " +
                "FROM Movie " +
                "LEFT JOIN KeywordSet ON Movie.movie_id = KeywordSet.movie_id " +
                "INNER JOIN FavoriteMovie ON Movie.movie_id = FavoriteMovie.movie_id " +
                "WHERE FavoriteMovie.user_id = ?";
        logger.sqlLog(query, createObjectArray(userId, userId));
        
        List<Movie> favoriteMovies = jdbcTemplate.query(query,
                BeanPropertyRowMapper.newInstance(Movie.class),
                userId, userId);
        
        for (Movie movie : favoriteMovies) {
            addGenres(movie);
        }
        
        return favoriteMovies;
    }

    public void addFavoriteMovie(int userId, int movieId) {
        String query = "CALL create_favorite_movie(?, ?)";
        logger.sqlLog(query, createObjectArray(userId, movieId));
        jdbcTemplate.update(query, userId, movieId);
    }

    public void deleteFavoriteMovie(int userId, int movieId) {
        String query = "DELETE FROM FavoriteMovie WHERE user_id = ? AND movie_id = ?";
        logger.sqlLog(query, createObjectArray(userId, movieId));
        jdbcTemplate.update(query, userId, movieId);
    }

    public void addComment(int userId, MovieComment comment) {
        String query = "CALL create_user_movie_comment(?, ?, ?)";
        logger.sqlLog(query, createObjectArray(userId, comment.getMovieId(), comment.getComment()));

        jdbcTemplate.update(query, userId, comment.getMovieId(), comment.getComment());

    }

    public void deleteComment(int userId, int commentId) {

        String query = "SELECT COUNT(*) FROM UserMovieComment WHERE user_id = ? AND comment_id = ?";
        logger.sqlLog(query, createObjectArray(userId, commentId));

        if (jdbcTemplate.queryForObject(query, Integer.class, userId, commentId) == 0) {
            throw new IllegalArgumentException("User does not own this comment");
        }


        query = "DELETE FROM UserMovieComment WHERE comment_id = ?";
        logger.sqlLog(query, createObjectArray(commentId));
        jdbcTemplate.update(query, commentId);
    }
}
