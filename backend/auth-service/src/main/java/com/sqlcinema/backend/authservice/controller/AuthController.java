package com.sqlcinema.backend.authservice.controller;

import com.sqlcinema.backend.authservice.model.LoginRequestParams;
import com.sqlcinema.backend.authservice.model.UserAccount;
import com.sqlcinema.backend.authservice.service.AuthService;
import com.sqlcinema.backend.authservice.util.ErrorInjector;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/")
public class AuthController {

    private final AuthService authService;

    @GetMapping("/")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from Auth Service");
    }

    @PostMapping(path = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<UserAccount> login(@RequestBody LoginRequestParams loginParams) {
        if (!ErrorInjector.isActivated()) {
            ErrorInjector.activate();
        }

        try {
            UserAccount logged = authService.login(loginParams.getUsername(), loginParams.getPassword());

            if (logged == null) {
                return ResponseEntity.notFound().build();
            }

            ErrorInjector.deactivate();
            return ResponseEntity.ok(logged);
        } catch (Exception e) {
            ErrorInjector.deactivate();
            return ResponseEntity.internalServerError().build();
        }
    }

}
