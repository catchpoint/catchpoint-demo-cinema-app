package com.sqlcinema.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Data
@SuperBuilder
@NoArgsConstructor
public class User {
    private int userId;
    private String email;
    private String fullName;
    private String avatarName;
    private String phoneNumber;
    private Date birthDate;
    private Date updatedAt;
}