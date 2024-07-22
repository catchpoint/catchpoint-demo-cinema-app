package com.sqlcinema.backend.model.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}
