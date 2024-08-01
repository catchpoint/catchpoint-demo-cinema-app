package com.sqlcinema.backend.repository;

import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.User;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.model.request.UserUpdateRequest;
import com.sqlcinema.backend.model.response.UserResponse;
import lombok.AllArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Repository
@AllArgsConstructor
public class UserRepository {


    private static final String USER_IMAGE_FILE_PREFIX = "static/images/user_";
    
    private final JdbcTemplate jdbcTemplate;

    private String getUserImageFile(int userId, String avatarName) {
        return USER_IMAGE_FILE_PREFIX
                .concat(String.valueOf(userId))
                .concat("_").concat(avatarName);
    }
    
    public UserAccount findUserAccountByUsername(String username) {
        UserAccount userAccount;
        
        try {
            userAccount = jdbcTemplate.queryForObject("SELECT ua.*, m.role FROM UserAccount ua" +
                            " LEFT JOIN Manager m ON ua.user_id = m.user_id WHERE username = ?",
                    BeanPropertyRowMapper.newInstance(UserAccount.class), username);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
        

        if (userAccount != null && userAccount.getRole() == null) {
            userAccount.setRole(Role.USER);
        }

        return userAccount;
    }

    public UserAccount findUserAccountById(int userId) {
        return jdbcTemplate.queryForObject("SELECT * FROM UserAccount WHERE user_id = ?",
                BeanPropertyRowMapper.newInstance(UserAccount.class), userId);
    }


    public void registerUser(String email, String username, String password) {
        jdbcTemplate.update("CALL create_user(?, ?, ?)", username, email, password);
    }

    public void loginUser(String username) {
        jdbcTemplate.update("UPDATE UserAccount " +
                "SET status = 'ACTIVE' " +
                "WHERE username = ?", username);
    }

    public void logoutUser(String username) {
        jdbcTemplate.update("UPDATE UserAccount " +
                "SET status = 'INACTIVE' " +
                "WHERE username = ?", username);
    }

    public void assignRole(int userId, Role role) {


        if (Role.USER.equals(role)) {
            jdbcTemplate.update("unassign_manager(?)", userId);
            return;
        }

        jdbcTemplate.update("CALL assign_manager(?, ?)", userId, role.getAuthority());
    }

    public void deleteUser(int userId) {
        jdbcTemplate.update("UPDATE UserAccount " +
                "SET status = 'DELETED' " +
                "WHERE user_id = ?", userId);
    }

    public User findUserById(int userId) {
        return jdbcTemplate.queryForObject("SELECT * FROM User WHERE user_id = ?",
                BeanPropertyRowMapper.newInstance(User.class), userId);
    }

    public void updateUser(int userId, UserUpdateRequest user) {
        jdbcTemplate.update("CALL update_user(?, ?, ?, ?, ?, ?)",
                userId,
                user.getFullName(),
                user.getUsername(),
                user.getAvatarName(),
                user.getPhoneNumber(),
                user.getBirthDate());
        
        
        if (user.getRole() != null) {
            if (Role.USER.equals(user.getRole())) {
                jdbcTemplate.update("CALL unassign_manager(?)", userId);
            } else {
                jdbcTemplate.update("CALL update_manager(?, ?)", userId, user.getRole().getAuthority());
            }
        }
    }
    
    public void updatePassword(int userId, String password) {
        jdbcTemplate.update("UPDATE UserAccount " +
                "SET password = ? " +
                "WHERE user_id = ?", password, userId);
    }

    public User findUserByEmail(String email) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM User WHERE email = ?",
                    BeanPropertyRowMapper.newInstance(User.class), email);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<UserResponse> getUsers() {
        try {
            return jdbcTemplate.query("SELECT u.user_id, u.full_name, ua.username, u.email, u.avatar_name, u.phone_number, u.birth_date, m.role " +
                            "FROM User u " +
                            "INNER JOIN UserAccount ua ON u.user_id = ua.user_id " +
                            "LEFT JOIN Manager m ON u.user_id = m.user_id " +
                            "WHERE ua.status != 'DELETED'", BeanPropertyRowMapper.newInstance(UserResponse.class))
                    .stream()
                    .peek(userResponse -> {
                        if (userResponse.getRole() == null) {
                            userResponse.setRole(Role.USER);
                        }
                    })
                    .toList();
        } catch (EmptyResultDataAccessException e) {
            return new ArrayList<>();
        }
    }

    public byte[] getProfile(int userId) {
        User user = findUserById(userId);
        
        if (user == null) {
            return null;
        }
        
        File file = new File(getUserImageFile(userId, user.getAvatarName()));
        if (!file.exists()) {
            return null;
        }

        try {
            return new FileInputStream(file).readAllBytes();
        } catch (IOException e) {
            return null;
        }
    }

    public void updateProfile(int userId, byte[] bytes) throws IOException {
        User user = findUserById(userId);
        
        if (user == null) {
            return;
        }
        
        File file = new File(getUserImageFile(userId, user.getAvatarName()));
        
        if (file.exists()) 
            file.delete();
        
        new FileOutputStream(file).write(bytes);
    }
}                                               
