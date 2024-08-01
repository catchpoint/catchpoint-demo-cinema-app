package com.sqlcinema.backend.model.request;

import lombok.Data;

@Data
public class NewPasswordRequest {
    private String oldPassword;
    private String newPassword;
}
