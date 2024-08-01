package com.sqlcinema.backend.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ADMIN,
    USER_MANAGER,
    THEATRE_MANAGER,
    USER;

    @Override
    public String getAuthority() {
        return name();
    }
    
    @Override
    public String toString() {
        return name();
    }
}
