package com.sqlcinema.backend.common;

import com.sqlcinema.backend.model.UserAccount;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class Constants {
    public static String JWT_SECRET;
    public static final long ONE_WEEK_AS_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;
    public static final String JWT_TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Authorization";
    public static final String LOGOUT_URL = "/api/account/logout";


    @Value("${jwt.secret}")
    public void setJwtSecret(String jwtSecret) {
        JWT_SECRET = jwtSecret;
    }
    
    public static String[] createStringArray(String... strings) {
        return strings;
    }

    public static Object[] createObjectArray(Object... objects) {
        return objects;
    }

    public static RequestMatcher getAnonymousEndpoints() {
        String [] urls = createStringArray(
                "/api/account/register",
                "/api/account/login",
                LOGOUT_URL,
                "/api/movie/**"
        );
        List<RequestMatcher> matchers = new ArrayList<>();
        for (String url : urls) {
            matchers.add(new AntPathRequestMatcher(url));
        }
        return new OrRequestMatcher(matchers);
        
    }
    
    public static UserAccount getCurrentUser() {
        
        if (SecurityContextHolder.getContext().getAuthentication() == null
            || SecurityContextHolder.getContext().getAuthentication().getPrincipal() == null 
                || SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser") 
        ) {
            return null;
        }

        return (UserAccount) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
