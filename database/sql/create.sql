DROP DATABASE IF EXISTS SQLCinema;
CREATE DATABASE SQLCinema;

USE SQLCinema;


-- ========================================== TABLES ==========================================
-- DROP 
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS UserAccount;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Manager;
DROP TABLE IF EXISTS FavoriteMovie;
DROP TABLE IF EXISTS UserMovieComment;
DROP TABLE IF EXISTS Reservation;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Theatre;
DROP TABLE IF EXISTS Seat;
DROP TABLE IF EXISTS Movie;
DROP TABLE IF EXISTS MovieGenre;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS Ticket;
DROP TABLE IF EXISTS KeywordSet;
DROP TABLE IF EXISTS Person;
DROP TABLE IF EXISTS ActorCredit;
DROP TABLE IF EXISTS CrewCredit;
DROP TABLE IF EXISTS Coupon;
DROP TABLE IF EXISTS PercentCoupon;
DROP TABLE IF EXISTS AmountCoupon;
DROP TABLE IF EXISTS ReservationSeat;


-- CREATE
CREATE TABLE User (
    user_id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    avatar_name VARCHAR(100) NOT NULL DEFAULT 'default.png',
    phone_number VARCHAR(20),
    birth_date DATE,
    updated_at DATETIME,
    PRIMARY KEY (user_id)
);

CREATE TABLE Movie (
    movie_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    runtime INT NOT NULL,
    overview MEDIUMTEXT,
    release_date DATE NOT NULL,
    rating FLOAT DEFAULT 0,
    backdrop_path VARCHAR(255),
    poster_path VARCHAR(255),
    trailer_link VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    language VARCHAR(100) NOT NULL DEFAULT 'English',
    PRIMARY KEY (movie_id)
);

CREATE TABLE UserAccount (
    user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'INACTIVE',
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE Reservation (
    reservation_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (reservation_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);


CREATE TABLE Theatre (
    theatre_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (theatre_id)
);


CREATE TABLE Genre (
    genre_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (genre_id)
);

CREATE TABLE Person (
    person_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    profile_path VARCHAR(255),
    PRIMARY KEY (person_id)
);

CREATE TABLE Ticket (
    ticket_id INT NOT NULL AUTO_INCREMENT,
    movie_id INT NOT NULL,
    price FLOAT NOT NULL,
    show_time DATETIME NOT NULL,
    theatre_id INT NOT NULL,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (theatre_id) REFERENCES Theatre(theatre_id) ON DELETE CASCADE
);


CREATE TABLE Activity (
    activity_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type VARCHAR(30) NOT NULL,
    activity_body VARCHAR(255) NOT NULL,
    issue_timestamp LONG NOT NULL,
    PRIMARY KEY (activity_id)
);

CREATE TABLE Manager (
    user_id INT NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE FavoriteMovie (
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (movie_id, user_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE UserMovieComment (
    comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    comment_at LONG nOT NULL DEFAULT (UNIX_TIMESTAMP() * 1000),
    comment VARCHAR(255) NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE
);

CREATE TABLE Payment (
    reservation_id INT NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_amount FLOAT NOT NULL,
    PRIMARY KEY (reservation_id),
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE
);


CREATE TABLE Seat (
    theatre_id INT NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    PRIMARY KEY (theatre_id, seat_code),
    FOREIGN KEY (theatre_id) REFERENCES Theatre(theatre_id) ON DELETE CASCADE
);

CREATE TABLE MovieGenre (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genre(genre_id) ON DELETE CASCADE
);

CREATE TABLE KeywordSet (
    movie_id INT NOT NULL,
    keywords MEDIUMTEXT NOT NULL,
    PRIMARY KEY (movie_id),
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE
);

CREATE TABLE ActorCredit (
    person_id INT NOT NULL,
    movie_id INT NOT NULL,
    `character` VARCHAR(100) NOT NULL,
    PRIMARY KEY (person_id, movie_id, `character`),
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE
);

CREATE TABLE CrewCredit (
    person_id INT NOT NULL,
    movie_id INT NOT NULL,
    job VARCHAR(100) NOT NULL,
    PRIMARY KEY (person_id, movie_id, job),
    FOREIGN KEY (person_id) REFERENCES Person(person_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE
);

CREATE TABLE Coupon (
    code VARCHAR(20) NOT NULL,
    expire_date DATE NOT NULL,
    coupon_left INT NOT NULL,
    activate_date DATE,
    PRIMARY KEY (code)
);

CREATE TABLE PercentCoupon (
    code VARCHAR(20) NOT NULL,
    rate FLOAT NOT NULL,
    up_to FLOAT NOT NULL,
    PRIMARY KEY (code),
    FOREIGN KEY (code) REFERENCES Coupon(code) ON DELETE CASCADE
);

CREATE TABLE AmountCoupon (
    code VARCHAR(20) NOT NULL,
    amount FLOAT NOT NULL,
    min_price FLOAT NOT NULL,
    PRIMARY KEY (code),
    FOREIGN KEY (code) REFERENCES Coupon(code) ON DELETE CASCADE
);

CREATE TABLE ReservationSeat (
    reservation_id INT NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    PRIMARY KEY (reservation_id, seat_code),
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE
);
