package com.sqlcinema.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.model.activity.ActivityType;
import com.sqlcinema.backend.model.request.LoginRequest;
import com.sqlcinema.backend.model.request.RegisterRequest;
import com.sqlcinema.backend.model.response.LoginResponse;
import com.sqlcinema.backend.model.response.UserResponse;
import com.sqlcinema.backend.service.JwtService;
import com.sqlcinema.backend.service.UserAccountService;
import com.sqlcinema.backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/account")
public class AccountController {

    @Value("${auth.service.url}")
    private String authServiceUrl;

    private final JwtService jwtService;
    private final UserAccountService userAccountService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final CustomLogger logger;
    private final ActivityManager activityManager;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public <T> T getUserAccount(String url, Object body, Class<T> responseType) {
        try {
            String request = objectMapper.writeValueAsString(body);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(request, headers);

            return restTemplate.postForObject(url, entity, responseType);
        } catch (Exception e) {
            logger.info("Error while getting user account from auth service: " + e.getMessage());
            return null;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        logger.info("Login request: " + loginRequest);

        UserAccount userAccount = getUserAccount(authServiceUrl.concat("/login"), loginRequest, UserAccount.class);
        if (userAccount == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponse user = UserResponse.fromUser(userService.getUserById(userAccount.getUserId()));
        user.setRole(userAccount.getRole());
        LoginResponse response = LoginResponse
                .builder()
                .token(jwtService.generateToken(userAccount))
                .user(user)
                .profile(userService.getProfile(userAccount.getUserId()))
                .userId(userAccount.getUserId()).build();

        activityManager.addActivity(userAccount.getUserId(), ActivityType.LOGIN, "User has logged in");
        return ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        logger.info("Register request: " + registerRequest);

        if (userAccountService.getUserAccountByUsername(registerRequest.getUsername()) != null ||
                userService.getUserByEmail(registerRequest.getEmail()) != null) {
            return badRequest().body("Username already exists");
        }
        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        userAccountService.registerUser(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                registerRequest.getPassword());

        int userId = userService.getUserByEmail(registerRequest.getEmail()).getUserId();
        activityManager.addActivity(userId, ActivityType.REGISTER, "User has registered");
        return ok("User registered");
    }

    @PostMapping("/assign-role")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> assignUserRole(@RequestParam String username, @RequestParam String role) {
        userAccountService.assignRole(username, Role.valueOf(role));
        int userId = userAccountService.getUserAccountByUsername(username).getUserId();
        activityManager.addActivity(userId, ActivityType.ASSIGN_ROLE, "User role changed");
        return ok("User role assigned");
    }

}
