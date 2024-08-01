package com.sqlcinema.backend.model.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private int userId;
    private UserResponse user;
    private byte[] profile;
}
