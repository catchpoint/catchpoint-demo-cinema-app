
USE SQLCinema;

-- =================================================================================================
-- ================================== PROCEDURES ===================================================

-- INSERT
DROP PROCEDURE IF EXISTS create_user;
DROP PROCEDURE IF EXISTS create_activity;
DROP PROCEDURE IF EXISTS assign_manager;
DROP PROCEDURE IF EXISTS create_movie;
DROP PROCEDURE IF EXISTS create_reservation;
DROP PROCEDURE IF EXISTS create_theatre;
DROP PROCEDURE IF EXISTS create_genre;
DROP PROCEDURE IF EXISTS create_person;
DROP PROCEDURE IF EXISTS assign_crew;
DROP PROCEDURE IF EXISTS assign_actor;
DROP PROCEDURE IF EXISTS create_ticket;
DROP PROCEDURE IF EXISTS create_favorite_movie;
DROP PROCEDURE IF EXISTS create_user_movie_comment;
DROP PROCEDURE IF EXISTS approve_payment;
DROP PROCEDURE IF EXISTS create_seat;
DROP PROCEDURE IF EXISTS assign_movie_genre;
DROP PROCEDURE IF EXISTS create_keyword_set;
DROP PROCEDURE IF EXISTS create_coupon;
DROP PROCEDURE IF EXISTS add_seat_to_reservation;

DELIMITER $$
CREATE PROCEDURE create_user(
    IN email VARCHAR(255),
    IN username VARCHAR(255), 
    IN password VARCHAR(255)
)
BEGIN
    INSERT INTO User(email) VALUES(email);
    INSERT INTO UserAccount(user_id, username, password) VALUES(LAST_INSERT_ID(), username, password);
END $$

CREATE PROCEDURE create_activity(
    IN user_id INT, 
    IN activity_type VARCHAR(30),
    IN activity_body VARCHAR(255)
)
BEGIN
    INSERT INTO Activity(user_id, activity_type, activity_body, issue_timestamp) VALUES(user_id, activity_type, activity_body, UNIX_TIMESTAMP() * 1000);
END $$

CREATE PROCEDURE assign_manager(
    IN user_id INT,
    IN role VARCHAR(20)
)
BEGIN
    INSERT INTO Manager(user_id, role) VALUES(user_id, role);
END $$

CREATE PROCEDURE create_movie (
    IN title VARCHAR(255),
    IN runtime INT,
    IN overview MEDIUMTEXT,
    IN poster_path VARCHAR(255),
    IN backdrop_path VARCHAR(255),
    IN release_date DATE,
    IN rating FLOAT,
    IN trailer_link VARCHAR(255),
    IN country VARCHAR(255),
    IN language VARCHAR(255),
    IN genre VARCHAR(255)
)
BEGIN


    INSERT INTO Movie(title, runtime, overview, poster_path, backdrop_path, release_date, rating, trailer_link, country, language)
                VALUES(title, runtime, overview, poster_path, backdrop_path, release_date, IFNULL(rating, 0), trailer_link, country, IFNULL(language, 'English'));

    INSERT INTO MovieGenre(movie_id, genre_id) VALUES(LAST_INSERT_ID(), (SELECT genre_id FROM Genre WHERE name = genre));
END $$

CREATE PROCEDURE create_reservation (
    IN user_id INT,
    IN ticket_id INT,
    IN seat_code VARCHAR(10)
)
BEGIN

    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    
    INSERT INTO Reservation(user_id, ticket_id) VALUES(user_id, ticket_id);

    IF ((SELECT COUNT(*) FROM available_seats WHERE ticket_id = ticket_id AND seat_code = seat_code) = 0) THEN
        ROLLBACK;
    ELSE
        INSERT INTO ReservationSeat(reservation_id, seat_code) VALUES(LAST_INSERT_ID(), seat_code);
        COMMIT;
    END IF;

    SET AUTOCOMMIT = 1;
END $$

CREATE PROCEDURE add_seat_to_reservation (
    IN reservation_id INT,
    IN ticket_id INT,
    IN seat_code VARCHAR(10)
)
BEGIN    
    SET AUTOCOMMIT = 0;
    START TRANSACTION;
    
    IF ((SELECT COUNT(*) FROM available_seats WHERE ticket_id = ticket_id AND seat_code = seat_code) = 0) THEN
        ROLLBACK;
    ELSE
        INSERT INTO ReservationSeat(reservation_id, seat_code) VALUES(reservation_id, seat_code);
        COMMIT;
    END IF;
    SET AUTOCOMMIT = 1;
END $$


CREATE PROCEDURE create_theatre (
    IN name VARCHAR(255),
    IN available BOOLEAN
)
BEGIN
    INSERT INTO Theatre(name, available) VALUES(name, available);
END $$

CREATE PROCEDURE create_genre (
    IN name VARCHAR(255)
)
BEGIN
    INSERT INTO Genre(name) VALUES(name);
END $$

CREATE PROCEDURE create_person (
    IN name VARCHAR(255),
    IN gender VARCHAR(20),
    IN profile_path VARCHAR(255)
)
BEGIN
    INSERT INTO Person(name, gender, profile_path) VALUES (name, gender, profile_path);
END $$

CREATE PROCEDURE assign_crew (
    IN person_name VARCHAR(255),
    IN movie_name VARCHAR(255),
    IN job VARCHAR(100)
)
BEGIN
    DECLARE person_id INT;
    DECLARE movie_id INT;

    SELECT p.person_id INTO person_id FROM Person p WHERE p.name = person_name LIMIT 1;
    SELECT m.movie_id INTO movie_id FROM Movie m WHERE m.title = movie_name LIMIT 1;

    INSERT INTO CrewCredit(person_id, movie_id, job) VALUES(person_id, movie_id, job);
END $$

CREATE PROCEDURE assign_actor (
    IN person_name VARCHAR(255),
    IN movie_name VARCHAR(255),
    IN `character` VARCHAR(100)
)
BEGIN
    DECLARE person_id INT;
    DECLARE movie_id INT;

    SELECT p.person_id INTO person_id FROM Person p WHERE p.name = person_name LIMIT 1;
    SELECT m.movie_id INTO movie_id FROM Movie m WHERE m.title = movie_name LIMIT 1;

    INSERT INTO ActorCredit(person_id, movie_id, `character`) VALUES(person_id, movie_id, `character`);
END $$

CREATE PROCEDURE create_ticket (
    IN movie_id VARCHAR(255),
    IN theatre_id VARCHAR(255),
    IN show_time DATETIME,
    IN price FLOAT
)

BEGIN
    INSERT INTO Ticket(movie_id, theatre_id, show_time, price) VALUES(movie_id, theatre_id, show_time, price);
END $$

CREATE PROCEDURE create_favorite_movie (
    IN user_id INT,
    IN movie_id INT
)
BEGIN
    INSERT INTO FavoriteMovie(user_id, movie_id) VALUES(user_id, movie_id);
END $$

CREATE PROCEDURE create_user_movie_comment (
    IN user_id INT,
    IN movie_id INT,
    IN comment_body VARCHAR(255)
)
BEGIN
    INSERT INTO UserMovieComment(user_id, movie_id, comment) VALUES(user_id, movie_id, comment_body);
END $$
CREATE PROCEDURE approve_payment (
    IN reservation_id INT,
    IN payment_type VARCHAR(50),
    IN payment_amount FLOAT
)
BEGIN
    INSERT INTO Payment(reservation_id, payment_type, payment_amount) VALUES(reservation_id, payment_type, payment_amount);
END $$
    

CREATE PROCEDURE create_seat (
    IN theatre_name VARCHAR(255),
    IN seat_code VARCHAR(10),
    IN seat_type VARCHAR(20)
)
BEGIN
    DECLARE theatre_id INT;
    SELECT t.theatre_id INTO theatre_id FROM Theatre t WHERE t.name = theatre_name;

    INSERT INTO Seat(theatre_id, seat_code, seat_type) VALUES(theatre_id, seat_code, seat_type);
END $$

CREATE PROCEDURE assign_movie_genre (
    IN movie_title VARCHAR(255),
    IN genre_name VARCHAR(255)
)
BEGIN
    DECLARE movie_id INT;
    DECLARE genre_id INT;
    SELECT m.movie_id INTO movie_id FROM Movie m WHERE m.title = movie_title;
    SELECT g.genre_id INTO genre_id FROM Genre g WHERE g.name = genre_name;
    INSERT INTO MovieGenre(movie_id, genre_id) VALUES(movie_id, genre_id);
END $$

CREATE PROCEDURE create_keyword_set (
    IN movie_name VARCHAR(255),
    IN keywords MEDIUMTEXT,
    IN in_place BOOLEAN
)
BEGIN
    DECLARE _movie_id INT;
    SELECT m.movie_id INTO _movie_id FROM Movie m WHERE m.title = movie_name;

    IF in_place OR (SELECT COUNT(*) FROM KeywordSet k WHERE k.movie_id = _movie_id) = 0 THEN
        INSERT INTO KeywordSet(movie_id, keywords) VALUES(_movie_id, keywords);
    ELSE
        UPDATE KeywordSet k SET k.keywords = keywords WHERE k.movie_id = _movie_id;
    END IF;
END $$

CREATE PROCEDURE create_coupon (
    IN code VARCHAR(20),
    IN coupon_left INT,
    IN expire_date DATE,
    IN activate_date DATE,
    IN discount_type VARCHAR(20),
    IN discount_size FLOAT,
    IN discount_price_limit FLOAT
)
BEGIN
    INSERT INTO Coupon(code, expire_date, coupon_left, activate_date) VALUES(code, expire_date, coupon_left, activate_date);

    IF discount_type = "AMOUNT" THEN
        INSERT INTO AmountCoupon(code, amount, min_price) VALUES(code, discount_size, discount_price_limit);
    ELSEIF discount_type = "PERCENT" THEN
        INSERT INTO PercentCoupon(code, rate, up_to) VALUES(code, discount_size, discount_price_limit);
    END IF;
END $$

DELIMITER ;
-- UPDATE
DROP PROCEDURE IF EXISTS update_if_not_null;
DROP PROCEDURE IF EXISTS update_user;
DROP PROCEDURE IF EXISTS update_movie;
DROP PROCEDURE IF EXISTS update_theatre;
DROP PROCEDURE IF EXISTS update_person;
DROP PROCEDURE IF EXISTS update_manager;
DROP PROCEDURE IF EXISTS update_ticket;
DROP PROCEDURE IF EXISTS update_user_movie_comment;
DROP PROCEDURE IF EXISTS update_coupon;
DROP PROCEDURE IF EXISTS update_seat;

DELIMITER $$

CREATE PROCEDURE update_movie (
    IN movie_id INT,
    IN title VARCHAR(255),
    IN runtime INT,
    IN overview MEDIUMTEXT,
    IN poster_path VARCHAR(255),
    IN backdrop_path VARCHAR(255),
    IN release_date DATE,
    IN trailer_link VARCHAR(255),
    IN country VARCHAR(255),
    IN language VARCHAR(255)
)
BEGIN
    UPDATE Movie m SET
        title = IFNULL(title, m.title),
        runtime = IFNULL(runtime, m.runtime),
        overview = IFNULL(overview, m.overview),
        poster_path = IFNULL(poster_path, m.poster_path),
        backdrop_path = IFNULL(backdrop_path, m.backdrop_path),
        release_date = IFNULL(release_date, m.release_date),
        trailer_link = IFNULL(trailer_link, m.trailer_link),
        country = IFNULL(country, m.country),
        language = IFNULL(language, m.language)
    WHERE m.movie_id = movie_id;
END $$

CREATE PROCEDURE update_theatre (
    IN theatre_id INT,
    IN name VARCHAR(255),
    IN available INT
)
BEGIN
    UPDATE Theatre t SET
        name = IFNULL(name, t.name),
        available = IFNULL(available, t.available)
    WHERE t.theatre_id = theatre_id;
END $$

CREATE PROCEDURE update_seat (
    IN theatre_id INT,
    IN seat_code VARCHAR(10),
    IN seat_type VARCHAR(20)
)
BEGIN
    UPDATE Seat S SET
        S.seat_type = IFNULL(seat_type, S.seat_type)
    WHERE S.theatre_id = theatre_id and S.seat_code=seat_code;
END $$

CREATE PROCEDURE update_user (
    IN user_id INT,
    IN full_name VARCHAR(255),
    IN username VARCHAR(255),
    IN avatar_name VARCHAR(100),
    IN phone_number VARCHAR(20),
    IN birth_date DATE
)
BEGIN
    UPDATE User u SET
        full_name = IFNULL(full_name, u.full_name),
        avatar_name = IFNULL(avatar_name, u.avatar_name),
        phone_number = IFNULL(phone_number, u.phone_number),
        birth_date = IFNULL(birth_date, u.birth_date)
    WHERE u.user_id = user_id;

    UPDATE UserAccount ua SET
        username = IFNULL(username, ua.username)
    WHERE ua.user_id = user_id;
END $$

CREATE PROCEDURE update_person (
    IN person_id INT,
    IN name VARCHAR(100),
    IN gender VARCHAR(20),
    IN profile_path VARCHAR(255)
)
BEGIN
    UPDATE Person p SET
        name = IFNULL(name, p.name),
        gender = IFNULL(name, p.name),
        profile_path = IFNULL(profile_path, p.profile_path)
    WHERE p.person_id = person_id;
END $$

CREATE PROCEDURE update_manager (
    IN user_id INT,
    IN role VARCHAR(20)
)
BEGIN
  IF (SELECT COUNT(*) FROM Manager m WHERE m.user_id = user_id) = 0 THEN
    INSERT INTO Manager(user_id, role) VALUES(user_id, role);
  ELSE
    UPDATE Manager m SET m.role = role WHERE m.user_id = user_id;
  END IF;
END $$


CREATE PROCEDURE update_ticket (
    IN ticket_id INT,
	IN theatre_id INT,
	IN show_time DATETIME,
    IN price FLOAT
)
BEGIN
    UPDATE Ticket t SET
        price = IFNULL(price, t.price),
        show_time = IFNULL(show_time, t.show_time),
        theatre_id = IFNULL(theatre_id, t.theatre_id)
    WHERE t.ticket_id = ticket_id;
END $$

CREATE PROCEDURE update_user_movie_comment (
    IN comment_id INT,
    IN comment VARCHAR(255)
)
BEGIN
    UPDATE UserMovieComment umc SET
        comment = IFNULL(comment, umc.comment)
    WHERE umc.comment_id = comment_id;
END $$


CREATE PROCEDURE update_coupon (
    IN code VARCHAR(20),
    IN coupon_left INT,
    IN expire_date DATE,
    IN activate_date DATE,
    IN discount_type VARCHAR(20),
    IN discount_size FLOAT,
    IN discount_price_limit FLOAT
)
BEGIN

    UPDATE Coupon c SET
        coupon_left = IFNULL(coupon_left, c.coupon_left),
        expire_date = IFNULL(expire_date, c.expire_date),
        activate_date = IFNULL(activate_date, c.activate_date)
    WHERE c.code = code;

    IF discount_type = "AMOUNT" THEN
        UPDATE AmountCoupon ac SET
            amount = IFNULL(discount_size, ac.amount),
            min_price = IFNULL(discount_price_limit, ac.min_price)
        WHERE ac.code = code;
        
    ELSEIF discount_type = "PERCENT" THEN
        UPDATE PercentCoupon pc SET
            rate = IFNULL(discount_size, pc.rate),
            up_to = IFNULL(discount_price_limit, pc.up_to)
        WHERE pc.code = code;
    END IF;
END $$

DELIMITER ;


-- DELETE
DROP PROCEDURE IF EXISTS delete_user;
DROP PROCEDURE IF EXISTS unassign_manager;
DROP PROCEDURE IF EXISTS delete_person;
DROP PROCEDURE IF EXISTS delete_movie;
DROP PROCEDURE IF EXISTS delete_theatre;
DROP PROCEDURE IF EXISTS delete_ticket;
DROP PROCEDURE IF EXISTS delete_user_movie_comment;
DROP PROCEDURE IF EXISTS delete_coupon;
DROP PROCEDURE IF EXISTS delete_reservation;
DROP PROCEDURE IF EXISTS delete_genre;
DROP PROCEDURE IF EXISTS delete_movie_genre;
DROP PROCEDURE IF EXISTS delete_activity;
DROP PROCEDURE IF EXISTS delete_keyword_set;
DROP PROCEDURE IF EXISTS delete_seat;

DELIMITER $$
CREATE PROCEDURE delete_user (
    IN user_id INT
)
BEGIN
    UPDATE UserAccount ua SET ua.status = 'DELETED' WHERE ua.user_id = user_id;
END $$

CREATE PROCEDURE delete_seat (
    IN theatre_id INT,
    IN seat_code VARCHAR(10)
)
BEGIN
    DELETE FROM Seat S WHERE S.theatre_id = theatre_id and S.seat_code=seat_code;
END $$

CREATE PROCEDURE unassign_manager (
    IN user_id INT
)
BEGIN
    DELETE FROM Manager m WHERE m.user_id = user_id;
END $$

CREATE PROCEDURE delete_person (
    IN person_id INT
)
BEGIN
    DELETE FROM Person p WHERE p.person_id = person_id;
END $$

CREATE PROCEDURE delete_movie (
    IN movie_id INT
)
BEGIN
    DELETE FROM Movie m WHERE m.movie_id = movie_id;
END $$

CREATE PROCEDURE delete_theatre (
    IN theatre_id INT
)
BEGIN
    DELETE FROM Theatre t WHERE t.theatre_id = theatre_id;
END $$

CREATE PROCEDURE delete_ticket (
    IN ticket_id INT
)
BEGIN
    DELETE FROM Ticket t WHERE t.ticket_id = ticket_id;
END $$

CREATE PROCEDURE delete_user_movie_comment (
    IN comment_id INT
)
BEGIN
    DELETE FROM UserMovieComment umc WHERE umc.comment_id = comment_id;
END $$

CREATE PROCEDURE delete_coupon (
    IN code VARCHAR(20)
)
BEGIN
    DELETE FROM Coupon c WHERE c.code = code;
END $$

CREATE PROCEDURE delete_reservation (
    IN reservation_id INT
)
BEGIN
    DELETE FROM Reservation r WHERE r.reservation_id = reservation_id;
END $$

CREATE  PROCEDURE delete_genre (
    IN genre_id INT
)
BEGIN
    DELETE FROM Genre g WHERE g.genre_id = genre_id;
END $$

CREATE PROCEDURE delete_movie_genre (
    IN movie_id INT,
    IN genre_id INT
)
BEGIN
    DELETE FROM MovieGenre mg WHERE mg.movie_id = movie_id AND mg.genre_id = genre_id;
END $$

CREATE PROCEDURE delete_activity (
    IN activity_id INT
)
BEGIN
    DELETE FROM Activity a WHERE a.activity_id = activity_id;
END $$

CREATE PROCEDURE delete_keyword_set (
    IN movie_id INT
)
BEGIN
    DELETE FROM KeywordSet ks WHERE ks.movie_id = movie_id;
END $$

DELIMITER ;