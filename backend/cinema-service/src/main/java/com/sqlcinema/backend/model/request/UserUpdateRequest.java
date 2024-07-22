package com.sqlcinema.backend.model.request;

import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@SuperBuilder
@NoArgsConstructor
public class UserUpdateRequest extends User {
    private String username;
    private String password;
    private Role role;
}
