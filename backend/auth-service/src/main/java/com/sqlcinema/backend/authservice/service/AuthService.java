package com.sqlcinema.backend.authservice.service;

import com.sqlcinema.backend.authservice.model.UserAccount;

public interface AuthService {

    UserAccount login(String username, String password) throws Exception;

}
