
USE SQLCinema;

-- =================================================================================================
-- ================================== TRIGGERS =====================================================

DROP TRIGGER IF EXISTS update_user_account_created_at;
DROP TRIGGER IF EXISTS update_user_last_login;
DROP TRIGGER IF EXISTS update_user_timestamp;
DROP TRIGGER IF EXISTS delete_user;
DROP TRIGGER IF EXISTS approve_reservation;
DROP TRIGGER IF EXISTS add_timestamp_user_report;
DROP EVENT IF EXISTS delete_expired_coupon;
DROP EVENT IF EXISTS delete_expired_ticket;


DELIMITER $$

CREATE TRIGGER update_user_account_created_at
BEFORE INSERT ON UserAccount
FOR EACH ROW
BEGIN
    IF NEW.created_at IS NULL THEN
        SET NEW.created_at = CURRENT_TIMESTAMP;
    END IF;
END $$

CREATE TRIGGER update_user_last_login
BEFORE UPDATE ON UserAccount
FOR EACH ROW
BEGIN
    IF NEW.status = 'ACTIVE' THEN
        SET NEW.last_login = CURRENT_TIMESTAMP;
    END IF;
END $$

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON User
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END $$

CREATE TRIGGER delete_user
AFTER UPDATE ON UserAccount
FOR EACH ROW
BEGIN
    IF NEW.status = 'DELETED' THEN
        DELETE FROM User WHERE user_id = NEW.user_id;
    END IF;
END $$

CREATE TRIGGER approve_reservation
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
    UPDATE Reservation SET created_at = CURRENT_TIMESTAMP
     WHERE reservation_id = NEW.reservation_id;
END $$
DELIMITER ;
CREATE EVENT delete_expired_coupon
ON SCHEDULE EVERY 1 DAY DO
DELETE FROM Coupon WHERE expire_date < CURRENT_TIMESTAMP;


CREATE EVENT delete_expired_ticket
ON SCHEDULE EVERY 1 DAY DO
DELETE FROM Ticket WHERE show_time < CURRENT_TIMESTAMP; 

CREATE EVENT delete_expired_activities
ON SCHEDULE EVERY 5 HOUR DO
DELETE FROM Activity WHERE issue_timestamp <  UNIX_TIMESTAMP(CURRENT_TIMESTAMP - INTERVAL 5 HOUR) * 5;
