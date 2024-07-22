USE SQLCinema;


CALL create_user("admin@cinema-app.local", "admin", "$2a$12$RBPf5EGwFD25DkIRQI17t.xGIjflLZKpnnhJIh0dgFxvA.ewzdTzS");
CALL create_user("manager@cinema-app.local", "manager", "$2a$12$d6Z3lvCPpRZG6wKkn.qOxuBBsLlUtfpm7l0ByCrth2.BFaEbPUGie");
CALL create_user("user@cinema-app.local", "user", "$2a$12$BrAcG6PEWrXFuRO4.Conf.ivoiXIBhkx3fNE3sFUqQcL0tN1q0AG6");
-- ASSIGN MANAGERS
CALL assign_manager((SELECT user_id FROM UserAccount WHERE username = "admin"), "ADMIN");
CALL assign_manager((SELECT user_id FROM UserAccount WHERE username = "manager"), "USER_MANAGER");
CALL assign_manager((SELECT user_id FROM UserAccount WHERE username = "user"), "USER");