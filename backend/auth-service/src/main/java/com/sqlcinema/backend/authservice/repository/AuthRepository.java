package com.sqlcinema.backend.authservice.repository;

import com.sqlcinema.backend.authservice.model.UserAccount;
import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@AllArgsConstructor
public class AuthRepository {

    private final JdbcTemplate jdbcTemplate;
    private final BeanPropertyRowMapper<UserAccount> rowMapper = new BeanPropertyRowMapper<>(UserAccount.class);

    public UserAccount getUserAccountByUsername(String username) {
        return jdbcTemplate.queryForObject("SELECT ua.*, m.role FROM UserAccount ua" +
                        " LEFT JOIN Manager m ON ua.user_id = m.user_id WHERE username = ?",
                rowMapper, username);
    }

    public void loginUser(String username) {
        jdbcTemplate.update("UPDATE UserAccount SET status = 'ACTIVE' WHERE username = ?", username);
    }

}
