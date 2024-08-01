USE SQLCinema;

DROP PROCEDURE IF EXISTS add_seat_loop;

DELIMITER $$

CREATE PROCEDURE add_seat_loop()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max INT DEFAULT 10;
    WHILE i <= max DO
        CALL create_seat(CONCAT("ROOM", i), "A01", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A02", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A03", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A04", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A05", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A06", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A07", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A08", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A09", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "A10", "REGULAR");

        CALL create_seat(CONCAT("ROOM", i), "B01", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B02", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B03", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B04", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B05", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B06", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B07", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B08", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B09", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "B10", "REGULAR");

        CALL create_seat(CONCAT("ROOM", i), "C01", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C02", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C03", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C04", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C05", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C06", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C07", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C08", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C09", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "C10", "VIP");


        CALL create_seat(CONCAT("ROOM", i), "D01", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D02", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D03", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D04", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D05", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D06", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D07", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D08", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D09", "VIP");
        CALL create_seat(CONCAT("ROOM", i), "D10", "VIP");


        CALL create_seat(CONCAT("ROOM", i), "E01", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E02", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E03", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E04", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E05", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E06", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E07", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E08", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E09", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "E10", "REGULAR");

        CALL create_seat(CONCAT("ROOM", i), "F01", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F02", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F03", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F04", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F05", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F06", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F07", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F08", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F09", "REGULAR");
        CALL create_seat(CONCAT("ROOM", i), "F10", "REGULAR");

        SET i = i + 1;
    END WHILE;
END $$
DELIMITER ;
CALL add_seat_loop();

DROP PROCEDURE IF EXISTS add_seat_loop;
