package com.sqlcinema.backend.service;

import com.sqlcinema.backend.model.UserAccount;

import java.util.Date;

public interface JwtService {
    String extractUsername(String token);
    String extractRole(String token);
    Date extractExpiration(String token);
    
    UserAccount extractUserAccount(String token);
    String generateToken(UserAccount userAccount);
    boolean validateToken(String token);
    
}
