package com.sqlcinema.backend.service.impl;

import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.repository.UserRepository;
import com.sqlcinema.backend.service.UserAccountService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserAccountServiceImpl implements UserDetailsService, UserAccountService {
    
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserAccountByUsername(username);
    }

    @Override
    public void registerUser(String username, String email, String password) {
        userRepository.registerUser(username, email, password);
    }

    @Override
    public UserAccount getUserAccountById(int userId) {
        return userRepository.findUserAccountById(userId);
    }

    @Override
    public void loginUser(UserAccount userAccount) {
        userRepository.loginUser(userAccount.getUsername());
    }

    @Override
    public void logoutUser(String username) {
        userRepository.logoutUser(username);
    }

    @Override
    public void assignRole(String username, Role role) {
        int userId = userRepository.findUserAccountByUsername(username).getUserId();
        userRepository.assignRole(userId, role);
    }

    @Override
    public UserAccount getUserAccountByUsername(String username) {
        return userRepository.findUserAccountByUsername(username);
    }
}
