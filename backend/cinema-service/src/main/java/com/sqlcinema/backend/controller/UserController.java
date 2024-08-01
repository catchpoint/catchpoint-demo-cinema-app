package com.sqlcinema.backend.controller;

import com.sqlcinema.backend.common.CustomLogger;
import com.sqlcinema.backend.manager.ActivityManager;
import com.sqlcinema.backend.model.Role;
import com.sqlcinema.backend.model.User;
import com.sqlcinema.backend.model.UserAccount;
import com.sqlcinema.backend.model.activity.ActivityType;
import com.sqlcinema.backend.model.request.NewPasswordRequest;
import com.sqlcinema.backend.model.request.UserUpdateRequest;
import com.sqlcinema.backend.model.response.UserResponse;
import com.sqlcinema.backend.service.UserAccountService;
import com.sqlcinema.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import static com.sqlcinema.backend.common.Constants.getCurrentUser;

@RestController
@RequestMapping("/api/user")
@AllArgsConstructor
public class UserController {

    private final CustomLogger logger;
    private final UserService userService;
    private final UserAccountService userAccountService;
    private final PasswordEncoder passwordEncoder;
    private final ActivityManager activityManager;

    @GetMapping({"/{userId}", "/me"})
    public ResponseEntity<UserResponse> getUser(@PathVariable(value = "userId", required = false) Integer userId) {
        if (userId != null && userId < 0) {
            return ResponseEntity.badRequest().build();
        }
        UserAccount userAccount = getCurrentUser();

        if (userId == null) {
            userId = userAccount.getUserId();
        } else {
            if (userAccount.getRole() == Role.USER || userAccount.getRole() == Role.THEATRE_MANAGER) {
                return ResponseEntity.badRequest().build();
            }
        }
        User user = userService.getUserById(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        UserResponse userResponse = UserResponse.fromUser(user);

        if (userId != userAccount.getUserId()) {
            userAccount = userAccountService.getUserAccountById(userId);
        }

        userResponse.setUsername(userAccount.getUsername());
        userResponse.setRole(userAccount.getRole());

        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('USER_MANAGER', 'ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }


    @PutMapping("/{userId}/update")
    public ResponseEntity<User> updateUser(@PathVariable int userId, @RequestBody UserUpdateRequest user) {

        UserAccount userAccount = getCurrentUser();
        if (userId != userAccount.getUserId()
                && userAccount.getRole().equals(Role.USER)
                || userAccount.getRole().equals(Role.THEATRE_MANAGER)) {
            return ResponseEntity.badRequest().build();
        }
        
        if (user.getPassword() != null) {
            return ResponseEntity.badRequest().build();
        }
        
        userService.updateUser(userId, user);
        activityManager.addActivity(userId, ActivityType.UPDATE, "User profile was updated");
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/me/update-password")
    public ResponseEntity<User> updatePassword(@RequestBody NewPasswordRequest request) {
        UserAccount userAccount = getCurrentUser();
        
        if (!passwordEncoder.matches(request.getOldPassword(), userAccount.getPassword())) {
            return ResponseEntity.badRequest().build();
        }
        
        if (passwordEncoder.matches(request.getNewPassword(), userAccount.getPassword())) {
            return ResponseEntity.ok().build();
        }
        
        userService.updatePassword(userAccount.getUserId(), passwordEncoder.encode(request.getNewPassword()));
        activityManager.addActivity(userAccount.getUserId(), ActivityType.UPDATE, "User password was updated");
        return ResponseEntity.ok().build();
    }
    

    @DeleteMapping("/{userId}/delete")
    public ResponseEntity<User> deleteUser(@PathVariable int userId) {
        UserAccount userAccount = getCurrentUser();
        if ((userId != userAccount.getUserId()
                && userAccount.getRole().equals(Role.USER) )
                || userAccount.getRole().equals(Role.THEATRE_MANAGER)) {
            return ResponseEntity.badRequest().build();
        }
        
        String username = userAccountService.getUserAccountById(userId).getUsername();
        
        userService.deleteUser(userId);
        if (userId != userAccount.getUserId()) {
            activityManager.addActivity(userAccount.getUserId(), 
                    ActivityType.DELETE, "User " + username + " was deleted");
        }
        return ResponseEntity.ok().build();
    }
    
    
    
    @GetMapping(path = "/me/profile", produces = "image/png")
    public ResponseEntity<byte[]> getProfile() {
        UserAccount userAccount = getCurrentUser();
        
        if (userAccount == null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok(userService.getProfile(userAccount.getUserId()));
    }

    @PostMapping(path = "/me/profile")
    public ResponseEntity<Void> uploadImage(@RequestParam("file") MultipartFile file) {
        UserAccount userAccount =  getCurrentUser();
        try {
            userService.uploadImage(userAccount.getUserId(), file.getBytes());
            activityManager.addActivity(userAccount.getUserId(), ActivityType.UPDATE, "User profile was updated");
            return ResponseEntity.ok().build();
        } catch (IOException ignored) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
}