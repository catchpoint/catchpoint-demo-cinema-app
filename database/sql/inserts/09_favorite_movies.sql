USE SQLCinema;


CALL create_favorite_movie(1, (SELECT movie_id FROM Movie WHERE title = "The Super Mario Bros. Movie"));
CALL create_favorite_movie(1, (SELECT movie_id FROM Movie WHERE title = "Murder Mystery 2"));
CALL create_favorite_movie(1, (SELECT movie_id FROM Movie WHERE title = "John Wick: Chapter 4"));
CALL create_favorite_movie(1, (SELECT movie_id FROM Movie WHERE title = "The Pope s Exorcist"));
CALL create_favorite_movie(1, (SELECT movie_id FROM Movie WHERE title = "65"));