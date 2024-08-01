package com.sqlcinema.backend.authservice.service.impl;

import com.sqlcinema.backend.authservice.model.UserAccount;
import com.sqlcinema.backend.authservice.repository.AuthRepository;
import com.sqlcinema.backend.authservice.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserAccount login(String username, String password) throws Exception {
        UserAccount userAccount = authRepository.getUserAccountByUsername(username);

        if (userAccount == null) {
            throw new Exception("Invalid username");
        }

        if (!passwordEncoder.matches(password, userAccount.getPassword())) {
            throw new Exception("Invalid password");
        }

        authRepository.loginUser(username);

        return userAccount;
    }

}
