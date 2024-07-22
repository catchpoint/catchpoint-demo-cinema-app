package com.sqlcinema.backend.service;

import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.UserAccount;

public interface UserAccountService {
    void registerUser(String username, String email, String password);
    UserAccount getUserAccountById(int userId);
    UserAccount getUserAccountByUsername(String username);
    void loginUser(UserAccount userAccount);
    void logoutUser(String username);
    void assignRole(String username, Role role);
}
