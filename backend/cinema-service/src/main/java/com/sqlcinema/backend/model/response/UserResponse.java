package com.sqlcinema.backend.model.response;

import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.User;
import lombok.Data;

import java.util.Date;

@Data
public class UserResponse {
    private int userId;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private String avatarName;
    private Date birthDate;
    private String phoneNumber;
    
    public static UserResponse fromUser(User user) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUserId(user.getUserId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFullName());
        userResponse.setAvatarName(user.getAvatarName());
        userResponse.setBirthDate(user.getBirthDate());
        userResponse.setPhoneNumber(user.getPhoneNumber());
        return userResponse;
    }
}
