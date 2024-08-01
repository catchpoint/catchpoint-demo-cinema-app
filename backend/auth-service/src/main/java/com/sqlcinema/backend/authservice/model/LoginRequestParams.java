package com.sqlcinema.backend.authservice.model;

import lombok.Data;

@Data
public class LoginRequestParams {
    
    private String username;
    private String password;
    
}
