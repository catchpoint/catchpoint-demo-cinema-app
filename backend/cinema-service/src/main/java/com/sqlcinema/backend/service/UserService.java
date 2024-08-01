package com.sqlcinema.backend.service;

import com.sqlcinema.backend.model.User;
import com.sqlcinema.backend.model.request.UserUpdateRequest;
import com.sqlcinema.backend.model.response.UserResponse;

import java.io.IOException;
import java.util.List;

public interface UserService {
    User getUserByEmail(String email);
    User getUserById(int userId);
    void updateUser(int userId, UserUpdateRequest user);
    void updatePassword(int userId, String password);
    
    void deleteUser(int userId);

    List<UserResponse> getUsers();

    byte[] getProfile(int userId);

    void uploadImage(int userId, byte[] bytes) throws IOException;
}