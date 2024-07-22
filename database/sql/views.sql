USE SQLCinema;

-- =================================================================================================
-- ================================== VIEWS ========================================================

DROP VIEW IF EXISTS get_available_amount_coupon;
DROP VIEW IF EXISTS get_available_percent_coupon;
DROP VIEW IF EXISTS available_movies;
DROP VIEW IF EXISTS revenue_movie;
DROP VIEW IF EXISTS get_users;
DROP VIEW IF EXISTS most_popular_genres;
DROP VIEW IF EXISTS user_reservations;
DROP VIEW IF EXISTS get_air_times;
DROP VIEW IF EXISTS available_seats;

CREATE VIEW user_reservations AS
SELECT r.user_id, r.reservation_id, m.title, t.theatre_id, rs.seat_code
FROM Reservation r
INNER JOIN ReservationSeat rs ON r.reservation_id = rs.reservation_id
INNER JOIN Ticket t ON r.ticket_id = t.ticket_id
INNER JOIN Movie m ON t.movie_id = m.movie_id;

CREATE VIEW available_seats AS
SELECT t.ticket_id, s.seat_code, s.seat_type
FROM Ticket t
INNER JOIN Seat s ON t.theatre_id = s.theatre_id
WHERE s.seat_code NOT IN 
(SELECT seat_code FROM ReservationSeat rs 
INNER JOIN (SELECT * FROM Reservation WHERE reservation.ticket_id = t.ticket_id) AS r 
ON r.reservation_id=rs.reservation_id);


CREATE VIEW most_popular_genres AS
SELECT g.name, COUNT(g.name) AS genre_count FROM Movie m
INNER JOIN MovieGenre mg ON m.movie_id = mg.movie_id
INNER JOIN Genre g ON mg.genre_id = g.genre_id
GROUP BY g.name
ORDER BY genre_count DESC;

CREATE VIEW get_available_amount_coupon AS
SELECT c.code, ac.amount, ac.min_price
FROM Coupon c
INNER JOIN AmountCoupon ac ON c.code = ac.code
WHERE c.expire_date > NOW() AND c.coupon_left > 0;

CREATE VIEW get_available_percent_coupon AS
SELECT c.code, pc.rate, pc.up_to
FROM Coupon c
INNER JOIN PercentCoupon pc ON c.code = pc.code
WHERE c.expire_date > NOW() AND c.coupon_left > 0;

CREATE VIEW get_users AS
SELECT u.user_id, u.email, ua.username
FROM User u
INNER JOIN UserAccount ua
ON u.user_id = ua.user_id;

CREATE VIEW revenue_movie AS
SELECT Movie.title, SUM(Payment.payment_amount) AS revenue
FROM Ticket 
INNER JOIN Reservation ON Ticket.ticket_id = Reservation.ticket_id
INNER JOIN Payment ON Reservation.reservation_id = Payment.reservation_id
INNER JOIN Movie ON movie.movie_id=ticket.movie_id
GROUP BY Movie.title;

CREATE VIEW available_movies AS
SELECT DISTINCT(Movie.title), Ticket.ticket_id FROM Ticket
INNER JOIN (SELECT ticket_id, COUNT(*) AS available_seat_count FROM available_seats GROUP BY ticket_id) AS seats
ON Ticket.ticket_id = seats.ticket_id
AND seats.available_seat_count > 0
INNER JOIN Movie 
ON Movie.movie_id = Ticket.movie_id;

CREATE VIEW get_air_times AS
SELECT Ticket.ticket_id, Movie.title, Ticket.show_time
FROM Movie
INNER JOIN Ticket 
ON ticket.movie_id = movie.movie_id;
